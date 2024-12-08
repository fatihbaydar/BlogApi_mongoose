"use strict";

// Call Models:
const { User } = require("../models/user.model");
const { NotFoundError } = require("../errors/customError");

module.exports.user = {
    list: async (req, res) => {
        const data = await User.find()

        res.send({
            result: data,
        });
    },

    //? CRUD ->

    create: async (req, res) => {
        const result = await User.create(req.body);

        res.send({
            result,
        });
    },

    read: async (req, res) => {
        const result = await User.findOne({ _id: req.params.userId });
        if (!result) {
            throw new NotFoundError("Eşleşen veri bulunamadı");
        }
        res.send({
            isError: false,
            result,
        });
    },

    update: async (req, res) => {
        const result = await User.updateOne(
            { _id: req.params.userId },
            req.body
        );

        //!güncellenmek istenen veri yoksa
        if (result.matchedCount === 0) {
          throw new NotFoundError("Eşleşen veri bulunamadı");
        // return res.status(404).send("Eşleşen veri bulunamadı");
        }
        //! güncellenmek istenen veri var ama zaten güncel olduğu için güncelleme yapılmadı:
        if (result.matchedCount > 0 && result.modifiedCount === 0) {
          return res.status(200).send({ message: "Belge zaten güncel." });
        }
        res.status(202).send({
            isError: false,
            result,
            new: await User.findOne({ _id: req.params.userId }),
        });
    },

    delete: async (req, res) => {
        const result = await User.deleteOne({ _id: req.params.userId });
        console.log(result);
        //deletedCount
        if (result.deletedCount === 0) {
            throw new NotFoundError("Eşleşen veri bulunamadı");
            // return res.status(404).send("Eşleşen veri bulunamadı");
        }
        //! 204 ile veri gönderilmez No_Content
        res.status(204).send({
            result,
        });
    },
};

