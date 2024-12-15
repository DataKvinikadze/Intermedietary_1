#! /usr/bin/env node

// თქვენი დავალებაა ააწყოთ expense-cli  ქომანდერის დახამრებით.
// 1) უნდა გქონდეს CRUD - create, read, update, delete, getById ფუნცქიონალი. იქსფენსების აპლიკაციაში უნდა გქონდეთ მინიმუმ 4 ფილდი. მაგალითად category, price, id, date დანარჩენი თქვენი ფანტაზიით დაამატეთ.
// 2) დამატების დროს აიდისთან ერთად დაამატეთ დრო, როდის მოხდა ამ იქსფენსის დამატება. და შესაბამისად show(ყველა იქსფენსის) ნახვის დროს გააყოლეთ --asc --desc რომელიც დაალაგებს შექმნის თარიღს ზრდადობა კლებადობით იქსფენსებს.
// 3) აფდეითის დროს უნდა დააფდეითოთ ნებისმიერი ფილდი რომელსაც გადააწოდებთ.
// 4) დაამატეთ ქომანდი, expense-cli price --asc ან --desc აქაც დაალაგებს ზრდადობა კლებადობით იქსფენსების ფასებს და ისე დაგიბრუნებთ.
// 5) შექმნის დროს დაადეთ ვალიდაცია მინიმალური ხარჯი უნდა იყოს 10 ლარი. მაგაზე ნაკლებს თუ შეიყვანს იუზერი რამე ერორი დაურტყით ვალიდაციის.

import { Command } from "commander";
import { writeFile } from "fs";
import fs from "fs/promises";
import { parse } from "path";

const program = new Command();

program
  .command("add")
  .argument("<category>")
  .argument("<price>")
  .action(async (category, price) => {
    if (Number(price) < 10) {
      return console.log("Price must be higer than 10!");
    }

    const expense = await fs.readFile("expense.json", "utf-8");
    const parsedExpense = JSON.parse(expense);

    const date = new Date();
    const id = parsedExpense[parsedExpense.length - 1]?.id || 0;

    const newExpense = {
      id: id + 1,
      date,
      category,
      price: Number(price),
    };

    parsedExpense.push(newExpense);

    await fs.writeFile("expense.json", JSON.stringify(parsedExpense));
    console.log("New Expense Has Been added successfully");
  });

program
  .command("show")
  .option("--asc")
  .option("--desc")
  .action(async (args) => {
    const expense = await fs.readFile("expense.json", "utf-8");
    const parsedExpense = JSON.parse(expense);
    if (args.asc) {
      let sortedData = parsedExpense.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      console.log(sortedData);
    }
    if (args.desc) {
      let sortedData = parsedExpense.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      console.log(sortedData);
    }
    console.log(parsedExpense);
  });

program
  .command("update")
  .argument("<id>")
  .option("--price <price>")
  .option("--category <category>")
  .action(async (id, args) => {
    const expense = await fs.readFile("expense.json", "utf-8");
    const parsedExpense = JSON.parse(expense);

    const exist = parsedExpense.findIndex((el) => el.id == id);

    if (exist == -1) {
      console.log("Expense with this ID does not exist");
      return;
    }

    const expenseData = parsedExpense[exist];
    console.log(expenseData);

    if (args.price) {
      expenseData.price = Number(args.price);
    }
    if (args.category && args.category < 10) {
      expenseData.category = args.category;
    } else if (args.category > 9) {
      console.log("higer");
    }

    await fs.writeFile("expense.json", JSON.stringify(parsedExpense));
    console.log("Expense Has Been successfully Updated!");
  });

program
  .command("delete")
  .argument("<id>")
  .action(async (id) => {
    const expense = await fs.readFile("expense.json", "utf-8");
    const parsedExpense = JSON.parse(expense);

    const exist = parsedExpense.findIndex((el) => el.id == id);

    if (exist == -1) {
      console.log("Expense with this ID does not exist");
      return;
    }

    const deleted = parsedExpense.splice(exist, 1);

    console.log(deleted);

    await fs.writeFile("expense.json", JSON.stringify(parsedExpense));

    console.log("Expense has Successfully been deleted!");
  });

program
  .command("price")
  .option("--asc")
  .option("--desc")
  .action(async (args) => {
    const expense = await fs.readFile("expense.json", "utf-8");
    const parsedExpense = JSON.parse(expense);

    if (args.asc) {
      let sortedData = parsedExpense.sort(
        (a, b) => new Date(a.price) - new Date(b.price)
      );

      console.log(sortedData);
    }
    if (args.desc) {
      let sortedData = parsedExpense.sort(
        (a, b) => new Date(b.price) - new Date(a.price)
      );

      console.log(sortedData);
    }
  });

program.parse();
