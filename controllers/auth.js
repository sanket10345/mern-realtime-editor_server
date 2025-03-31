const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

// Define User model (if not using separate models folder)
const User = sequelize.define("User", {
   firstName: { type: DataTypes.STRING, allowNull: false },
   email: { type: DataTypes.STRING, unique: true, allowNull: false },
   password: { type: DataTypes.STRING, allowNull: false }
}, {
   timestamps: true,
   tableName: "users"
});

// Registration Controller
exports.register = async (req, res) => {
    try {
       const { firstName, email, password } = req.body;
       const hashedPassword = password //await bcrypt.hash(password, 10);
       const user = await User.create({ firstName, email, password: hashedPassword });
       res.json({ success: true, user });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: error.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
       const { email, password } = req.body;
       const user = await User.findOne({ where: { email } });
       console.log("user-------------->",user)
       if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
       
      //  const valid = await bcrypt.compare(password, user.password);
      //  if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });
       
       res.json({ success: true, userId: user.id });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: error.message });
    }
};