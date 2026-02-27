require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Bidder = require('./models/Bidder');
const Department = require('./models/Department');
const Staff = require('./models/Staff');

async function seed() {
  await connectDB();
  console.log('Seeding data...');
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Bidder.deleteMany();
    await Department.deleteMany();
    await Staff.deleteMany();

    const admin = await User.create({ name: 'Super Admin', email: 'isurusenarath6699@gmail.com', password: require('bcryptjs').hashSync('123.', 10), role: 'Super Admin' });
    console.log('Created super admin:', admin.email);

    await Category.create([{ name: 'Goods' }, { name: 'Services' }, { name: 'Works' }, { name: 'Consultancy' }]);
    console.log('Categories created');

    await Department.create([{ name: 'Finance', code: 'FIN' }, { name: 'Procurement', code: 'PRC' }]);
    console.log('Departments created');

    await Bidder.create([{ name: 'ABC Suppliers', email: 'abc@example.com', contact: '0771234567' }]);
    console.log('Bidders created');

    await Staff.create([{ name: 'John Doe', email: 'john@example.com', area: 'Procurement', designation: 'Officer' }]);
    console.log('Staff created');

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
