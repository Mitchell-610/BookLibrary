const { User, Book} = require('../models');
const mongoose = require('mongoose');

const resolvers = {
    Query: {
        User: async () => {
            const users = await User.find({}).populate('books');
            return users.map(user => ({
              ...user.toObject(),
              savedBooks: user.savedBooks || []
            }));
          },
          oneUser: async (parent, { UserId }) => {
            return User.findOne({ _id: UserId });
          },
          Book: async () => {
            const data = Book.find({});
            console.log(data);
            return Book.find({});
          },
          OneBook: async (parent, { bookId }) => {
            console.log(book);
            return Book.findOne({ _id: bookId });
          },
        },
        Mutation: {
            addUser: async (parent, { email, userName, password }) => {
              try {
                const existingUser = await User.findOne({ userName });
                if (existingUser) {
                  throw new Error('Username already exists');
                }
                const newUser = new User({ email, userName, password });
                console.log(newUser);
                const savedUser = await newUser.save();
                return savedUser;
              } catch (error) {
                console.error('Error adding user:', error);
                throw new Error(`Failed to add user: ${error.message}`);
              }
            },
            addBook: async (parent, { UserId, book }) => {
              try {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: UserId },
                  { $addToSet: { books: book } },
                  { new: true, runValidators: true }
                );
                
                if (!updatedUser) {
                  throw new Error('User not found');
                }
                
                return updatedUser;
              } catch (error) {
                throw new Error(`Failed to add skill: ${error.message}`);
              }
            },
            removeBook: async (parent, { UserId, book }) => {
              return User.findOneAndUpdate(
                { _id: UserId },
                { $pull: { books: book } },
                { new: true }
              );
            },
          },
    };

    module.exports = resolvers;
