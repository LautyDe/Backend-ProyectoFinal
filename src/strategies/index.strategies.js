import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { usersModel } from "../DAL/mongoDb/models/users.model.js";
import { hashData, compareData, passwordGenerator } from "../utils.js";
import UsersDTO from "../DAL/DTOs/userDB.dto.js";
import { cartsService } from "../services/carts.service.js";
import config from "../config.js";

//local
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await usersModel.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      const passwordOk = await compareData(password, user.password);
      if (!passwordOk) {
        return done(null, false);
      }
      user.last_connection = new Date();
      if (!user.cart) {
        user.cart = cartsService.createOne();
      }
      user.save();
      done(null, user);
    }
  )
);

//register
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await usersModel.findOne({ email });
      if (userDB) {
        return done(null, false);
      }
      const hashPassword = await hashData(password);
      const newUser = { ...req.body, password: hashPassword };
      const userDto = new UsersDTO(newUser);
      userDto.last_connection = new Date();
      const newCart = await cartsService.createOne();
      const cartId = newCart._id;
      const usersCart = { ...userDto, cart: cartId };
      if (email === config.admin_email) {
        usersCart.role = config.role_admin;
      }
      const newUserDB = await usersModel.create(usersCart);
      done(null, newUserDB);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await usersModel.findById(id);
  done(null, user);
});

//github
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: config.github_client_id,
      clientSecret: config.github_client_secret,
      callbackURL: config.github_callback_url,
      passReqToCallback: true,
    },
    async (req, accesToken, refresToken, profile, done) => {
      const email = profile._json.email;
      const userDB = await usersModel.findOne({ email });
      if (userDB) {
        userDB.last_connection = new Date();
        if (!userDB.cart) {
          const newCart = await cartsService.createOne();
          const cartId = newCart._id;
          userDB.cart = cartId;
        }
        await userDB.save();
        return done(null, userDB);
      }
      const securePassword = await passwordGenerator();
      const newUser = {
        first_name: profile._json.name.split(" ")[0],
        last_name: profile._json.name.split(" ")[1] || "",
        email,
        password: await hashData(securePassword),
      };
      const userDto = new UsersDTO(newUser);
      if (userDto.email === config.admin_email) {
        userDto.role = config.role_admin;
      }
      const newCart = await cartsService.createOne();
      const cartId = newCart._id;
      const usersCart = { ...userDto, cart: cartId };
      usersCart.last_connection = new Date();
      const newUserDB = await usersModel.create(usersCart);
      if (!userDB.cart) {
        userDB.cart = cartsService.createOne();
      }

      done(null, newUserDB);
    }
  )
);
