import {Router} from "express";
import User from "../DB/User";
import sendEmail from "../services/sendEmail";

const router:Router = Router();

let time:any;

const createCode = ():number => {
		return parseInt((Math.floor(Math.random()*10)).toString()
		+(Math.floor(Math.random()*10)).toString()
		+(Math.floor(Math.random()*10)).toString()
		+(Math.floor(Math.random()*10)).toString());
}

async function timer(data:any) {
	await User.deleteOne({email: data.email});
	console.log("user eliminated");
}

router.get("/api/users", async (req:any, res:any) => {
	const data:object = await User.find();
	res.json(data);
});

router.post("/signin" , async (req, res) => {
	let data = req.body;
	const findUser:any = await User.findOne({email: data.email});

	const timeout: number = 30000;

	if (findUser) {
		if (findUser.status === "pending") {
			data.code = createCode();
			sendEmail(data);

			await User.updateOne({email: data.email}, {code: data.code});
			clearTimeout(time);
			time = setTimeout(() => {timer(data)}, timeout);
			console.log("codigo actualizado", data.code);
		} else if (findUser.status === "registered") {
			res.json("registered");
		}
	} else {
		data.code = createCode();
		sendEmail(data);
		
		const user = new User(data);
		time = setTimeout(() => {timer(data)}, timeout);
		await user.save();
		console.log("registrado", user);
		res.json("sended");
	}
});

router.post("/verificate", async(req, res) => {
	const {code, user} = req.body;
	const verUser:any = await User.findOne({email: user.email});
	if (verUser.code == code) {
		clearTimeout(time);
		await User.updateOne({email: user.email}, {status: "registered"});
		res.json(verUser);
	}
});

router.post("/login", async (req, res) => {
	const data = req.body.state;
	const findUser:any = await User.findOne({email: data.email});
	console.log(data, findUser);
	if (findUser) {
		if (data.psw == findUser.psw) {
			res.json({res: findUser});
		} else {
			res.json({res: "error"});
		}
	} else {
		res.json({res: "not found"});
	}
});

export default router;