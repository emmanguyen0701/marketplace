import { Server } from 'socket.io'

import Auction from '../models/auction.model'

export default (server) => {
    const io = new Server(server)

    io.on('connection', (socket) => {
        // join a channel with the id == roomId
        socket.on('join auction room', (args) => {
            socket.join(args.room)
        })

        // leave a channel
        socket.leave('leave auciton room', (args) => {
            socket.leave(args.room)
        })

        // receive new bid
        socket.on('new bid', (args) => {
            receiveBid(args.newBidInfo, args.roomId)
        })
    })

    const receiveBid = async (newBidInfo, auctionId) => {
        try {
            // find auction with auctionID and update its bids array
            // where either the first bid is less than the new bid
            // or the bids array is empty
            const filter = {
                _id: auctionId,
                $or: [
                    { 'bids.0.bid': { $lt: parseInt(newBidInfo.bid) } },
                    { 'bids': { $eq: [] } }
                ]
            }
            const update = {
                $push: {
                    bids: {
                        $each: [newBidInfo],
                        $position: 0
                    }
                }
            }
            let result = await Auction.findOneAndUpdate(filter, update, { new: true })
                            .populate('bids.bidder', '_id name')
                            .populate('seller', '_id name')
                            .exec()

            io.to(auctionId).emit('new bid', result)
        } catch(err) {
            console.log(err)
        }
    } 
}