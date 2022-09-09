import formidable from "formidable"
import fs from 'fs'

import dbErrorHandler from '../helpers/dbErrorHandler'
import Auction from '../models/auction.model'

const getAuctionById = async (req, res, next, auctionId) => {
    try {
        const auction = await Auction.findById(auctionId)
                                    .populate('seller', '_id name')
                                    .populate('bids.bidder', '_id name')
                                    .exec()
        if (!auction) {
            return res.status(400).json({error: "Counldn't find auction" })
        }

        req.auction = auction
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}
const getAuction = (req, res) => {
    req.auction.image = undefined
    return res.status(200).json(req.auction)
}

const createAuction = (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Couldn't upload image. Plesae try again." })
        }
        const auction = new Auction(fields)
        auction.seller = req.profile
        if (files.image) {
            auction.image.data = fs.readFileSync(files.image.filepath)
            auction.image.contentType = files.image.mimetype
        }
        try {
            auction.save()
            return res.status(200).json({ message: 'Auction saved.' })
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

const getAllAuctions = async (req, res) => {
    // const auctions = await Auction.find({ 'bidEnd': { $gte: new Date() }})
    const auctions = await Auction.find({})
                                .sort('bidStart')
                                .populate('seller', '_id name')
                                .populate('bids.bidder', '_id name')
                                .exec()
    return res.status(200).json(auctions)
}

const getAuctionImage = async (req, res) => {
    res.set('Content-Type', req.auction.image.contentType)
    return res.status(200).send(req.auction.image.data)
}

export default { getAuctionById, getAuction, createAuction, getAllAuctions, getAuctionImage }