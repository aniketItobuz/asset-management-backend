import { employeeModel } from "../models/employee.js";
import { employeeZodSchema } from "../zod/zodSchema.js";

export const getAllEmployees = async (req, res) => {
  try {
    // Get `page`, `limit`, `name`, `email`, and `status` from query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name ? req.query.name.trim() : '';
    const email = req.query.email ? req.query.email.trim() : '';
    const status = req.query.status ? req.query.status.trim() : '';

    // Calculate the number of documents to skip
    const startIndex = (page - 1) * limit;

    // Build the query object
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' }; // Case-insensitive search for email
    }
    if (status) {
      query.status = status; // Exact match for status
    }

    // Fetch employees with pagination and search
    const employees = await employeeModel.find(query).skip(startIndex).limit(limit);

    // Get total number of employees for pagination metadata
    const totalEmployees = await employeeModel.countDocuments(query);

    return res.json({
      data: employees,
      meta: {
        total: totalEmployees,
        page,
        limit,
        totalPages: Math.ceil(totalEmployees / limit),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};



export const getEmployeeById = async (req, res) => {
  try {
    const emp = await employeeModel.findById(req.params.id);
    return res.json({
      data: emp,
    });
  } catch (err) {
    console.log(err);
  }
};

export const addEmployee = async (req, res) => {
  const result = employeeZodSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  const emp = new employeeModel(result.data);

  try {
    const a1 = await emp.save();
    res.json(a1);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const emp = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        team: req.body.team,
      },
      { new: true } // Return the updated document
    );
    if (!emp) {
      return res.status(404).send("Employee not found");
    }
    res.json(emp);
  } catch (err) {
    res.send("Error" + err);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const emp = await employeeModel.findByIdAndDelete(req.params.id);
    res.send("Employee deleted");
  } catch (err) {
    res.send("Error" + err);
  }
};
