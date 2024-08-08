const { BorrowingProcess, Book, Borrower } = require('../models');
const { Op } = require('sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

class ReportsController {
  static async getBorrowingReport(req, res) {
    try {
      const { startDate, endDate, format } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }

      const borrowingProcesses = await BorrowingProcess.findAll({
        where: {
          checkout_date: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        include: [
          { model: Book, attributes: ['title', 'author', 'ISBN'] },
          { model: Borrower, attributes: ['name', 'email'] }
        ]
      });

      const reportData = borrowingProcesses.map(bp => ({
        book_title: bp.Book.title,
        book_author: bp.Book.author,
        book_ISBN: bp.Book.ISBN,
        borrower_name: bp.Borrower.name,
        borrower_email: bp.Borrower.email,
        checkout_date: bp.checkout_date,
        due_date: bp.due_date,
        return_date: bp.return_date
      }));

      if (format === 'csv') {
        return await ReportsController.exportToCsv(res, reportData, 'borrowing_report');
      } else if (format === 'xlsx') {
        return await ReportsController.exportToXlsx(res, reportData, 'borrowing_report');
      } else {
        res.json(reportData);
      }
    } catch (error) {
      console.error('Error generating borrowing report:', error);
      res.status(500).json({ message: 'An error occurred while generating the report' });
    }
  }

  static async getOverdueBorrowsLastMonth(req, res) {
    try {
      const { format } = req.query;
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      const overdueBorrows = await BorrowingProcess.findAll({
        where: {
          due_date: {
            [Op.lt]: today,
            [Op.gte]: lastMonth
          },
          return_date: null
        },
        include: [
          { model: Book, attributes: ['title', 'author', 'ISBN'] },
          { model: Borrower, attributes: ['name', 'email'] }
        ]
      });

      const reportData = overdueBorrows.map(bp => ({
        book_title: bp.Book.title,
        book_author: bp.Book.author,
        book_ISBN: bp.Book.ISBN,
        borrower_name: bp.Borrower.name,
        borrower_email: bp.Borrower.email,
        checkout_date: bp.checkout_date,
        due_date: bp.due_date,
        days_overdue: Math.ceil((today - new Date(bp.due_date)) / (1000 * 60 * 60 * 24))
      }));

      if (format === 'csv') {
        return await ReportsController.exportToCsv(res, reportData, 'overdue_borrows_last_month');
      } else if (format === 'xlsx') {
        return await ReportsController.exportToXlsx(res, reportData, 'overdue_borrows_last_month');
      } else {
        res.json(reportData);
      }
    } catch (error) {
      console.error('Error generating overdue borrows report:', error);
      res.status(500).json({ message: 'An error occurred while generating the report' });
    }
  }


  static async getAllBorrowingProcessesLastMonth(req, res) {
    try {
      const { format } = req.query;
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      const borrowingProcesses = await BorrowingProcess.findAll({
        where: {
          checkout_date: {
            [Op.gte]: lastMonth,
            [Op.lte]: today
          }
        },
        include: [
          { model: Book, attributes: ['title', 'author', 'ISBN'] },
          { model: Borrower, attributes: ['name', 'email'] }
        ]
      });

      const reportData = borrowingProcesses.map(bp => ({
        book_title: bp.Book.title,
        book_author: bp.Book.author,
        book_ISBN: bp.Book.ISBN,
        borrower_name: bp.Borrower.name,
        borrower_email: bp.Borrower.email,
        checkout_date: bp.checkout_date,
        due_date: bp.due_date,
        return_date: bp.return_date,
        status: bp.return_date ? 'Returned' : (new Date(bp.due_date) < today ? 'Overdue' : 'Ongoing')
      }));

      if (format === 'csv') {
        return await ReportsController.exportToCsv(res, reportData, 'all_borrowing_processes_last_month');
      } else if (format === 'xlsx') {
        return await ReportsController.exportToXlsx(res, reportData, 'all_borrowing_processes_last_month');
      } else {
        res.json(reportData);
      }
    } catch (error) {
      console.error('Error generating all borrowing processes report:', error);
      res.status(500).json({ message: 'An error occurred while generating the report' });
    }
  }



  static async exportToCsv(res, data, filename) {
    const csvWriter = createCsvWriter({
      path: `${filename}.csv`,
      header: [
        { id: 'book_title', title: 'Book Title' },
        { id: 'book_author', title: 'Book Author' },
        { id: 'book_ISBN', title: 'Book ISBN' },
        { id: 'borrower_name', title: 'Borrower Name' },
        { id: 'borrower_email', title: 'Borrower Email' },
        { id: 'checkout_date', title: 'Checkout Date' },
        { id: 'due_date', title: 'Due Date' },
        { id: 'return_date', title: 'Return Date' }
      ]
    });

    await csvWriter.writeRecords(data);

    res.download(`${filename}.csv`, err => {
      if (err) {
        console.error('Error downloading CSV:', err);
        res.status(500).send('Error downloading file');
      }
      fs.unlinkSync(`${filename}.csv`);
    });
  }

  static async exportToXlsx(res, data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Borrowing Report');
    
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }
}

module.exports = ReportsController;