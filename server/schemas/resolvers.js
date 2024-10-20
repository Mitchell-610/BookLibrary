// resolvers/index.js
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get a single user by ID
    async getSingleUser(_, { id }, context) {
      const foundUser = await User.findOne({ _id: id });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }

      return foundUser;
    },
  },
  Mutation: {
    // Create a user and sign a token
    async createUser(_, { username, email, password }) {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },
    
    // Login a user and sign a token
    async login(_, { username, email, password }) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    
    // Save a book to a user's savedBooks
    async saveBook(_, { bookId }, context) {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: { bookId } } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    // Remove a book from savedBooks
    async deleteBook(_, { bookId }, context) {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
