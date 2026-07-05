const ExcelJS = require("exceljs");
const Booking = require("../models/booking");

// Get All Bookings
const getBookings = async (req, res) => {
    try {

        const bookings = await Booking.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalBookings: bookings.length,
            data: bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Create Booking
const createBooking = async (req, res) => {
    try {

        const { name, phone, service, date, slot, notes } = req.body;

        // Get last booking
        const lastBooking = await Booking.findOne().sort({ createdAt: -1 });

        let tokenNumber = 101;

        if (lastBooking && lastBooking.token) {
            tokenNumber = parseInt(lastBooking.token.substring(1)) + 1;
        }

        const token = "A" + tokenNumber;

        const booking = new Booking({
            name,
            phone,
            service,
            date,
            slot,
            notes,
            token,
            status: "Waiting"
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: "Booking Created Successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Status Updated Successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const deleteBooking = async (req, res) => {
    try {

        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const exportBookings = async (req, res) => {

    try {

        const bookings = await Booking.find().sort({ createdAt: 1 });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Bookings");

        worksheet.columns = [
            { header: "Token", key: "token", width: 15 },
            { header: "Name", key: "name", width: 25 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Service", key: "service", width: 30 },
            { header: "Date", key: "date", width: 20 },
            { header: "Slot", key: "slot", width: 25 },
            { header: "Status", key: "status", width: 20 }
        ];

        bookings.forEach((booking) => {

            worksheet.addRow({

                token: booking.token,
                name: booking.name,
                phone: booking.phone,
                service: booking.service,
                date: booking.date,
                slot: booking.slot,
                status: booking.status

            });

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=bookings.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {
    getBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    exportBookings
};