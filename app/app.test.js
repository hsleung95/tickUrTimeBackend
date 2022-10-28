const app = require("../app");
const request = require("supertest");

describe("test token", () => {
	let token;
	test("POST /token", async () => {
		var res = await request(app)
			.post("/token")
			.expect("Content-Type", /json/)
			.send({});

		expect(res.statusCode).toBe(200);
		token = res.body.token;
	});
	
	test("no token", async () => {
		var res = await request(app)
			.get("/activities")
			.send({});

		expect(res.statusCode).toBe(403);
	});
	
	test("invalid token", async () => {
		var res = await request(app)
			.get("/activities")
			.set("token","invalidtoken")
			.send({});

		expect(res.statusCode).toBe(400);
	});
	
	var firstActivity;
	test("GET /activities", async () => {
		var res = await request(app)
			.get("/activities")
			.set("token", token)
			.send({});

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(3);
		firstActivity = res.body[0].id;
	});
	
	test("POST /activities", async () => {
		var emptyBody = await request(app)
			.post("/activities")
			.expect("Content-Type", /json/)
			.set("token", token)
			.send();
			
		expect(emptyBody.statusCode).toBe(400);

		var res = await request(app)
			.post("/activities")
			.expect("Content-Type", /json/)
			.set("token", token)
			.send({
				"userId": token,
				"name": "coding",
				"commonlyUsed": false
			});
			
		expect(res.statusCode).toBe(200);
	});
	
	test("PUT /activities", async () => {
		var emptyBody = await request(app)
			.put("/activities/"+firstActivity)
			.set("token", token)
			.send();

		expect(emptyBody.statusCode).toBe(400);

		var res = await request(app)
			.put("/activities/"+firstActivity)
			.set("token", token)
			.send({
				"name": "coding"
			});

		expect(res.statusCode).toBe(200);
	});
	
	test("DELETE /activities", async () => {
		await request(app)
			.delete("/activities/"+firstActivity)
			.set("token", token)
			.expect(200);
	});

	test("GET /activities/all", async () => {
		var res = await request(app)
			.get("/activities/all")
			.set("token", token)
			.send({});

		expect(res.statusCode).toBe(200);
	});

	var firstActivityRecord;
	test("POST /activityRecords", async () => {
		var emptyBody = await request(app)
			.post("/activityRecords")
			.expect("Content-Type", /json/)
			.set("token", token)
			.send();
			
		expect(emptyBody.statusCode).toBe(400);

		var res = await request(app)
			.post("/activityRecords")
			.expect("Content-Type", /json/)
			.set("token", token)
			.send({
				"activity": "<script> console.log(\"hello world!\"); </script>",
				"startTime": "2022-07-17 21:26",
				"endTime": "2022-07-17 22:26",
				"timeSpent": 6000,
				"userId" : token,
				"description": "",
				"estimatedTime":"2202-07-17 22:26"
			});
			
		expect(res.statusCode).toBe(200);
	});

	test("GET /activityRecords", async () => {
		var res = await request(app)
			.get("/activityRecords")
			.set("token", token)
			.send({});

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(1);
		firstActivityRecord = res.body[0].id;
	});
	
	test("PUT /activityRecords", async () => {
		var emptyBody = await request(app)
			.put("/activityRecords/"+firstActivityRecord)
			.set("token", token)
			.send();

		expect(emptyBody.statusCode).toBe(400);

		var res = await request(app)
			.put("/activityRecords/"+firstActivityRecord)
			.set("token", token)
			.send({
				"description": "coding"
			});

		expect(res.statusCode).toBe(200);
	});
	
	test("PUT /activityRecords", async () => {
		var res = await request(app)
			.put("/activityRecords/"+firstActivityRecord)
			.set("token", token)
			.send({
				"description": "coding"
			});

		expect(res.statusCode).toBe(200);
	});

	test("DELETE /activityRecords", async () => {
		await request(app)
			.delete("/activityRecords/"+firstActivityRecord)
			.set("token", token)
			.expect(200);
	});

	test("GET /activityRecords/all", async () => {
		var res = await request(app)
			.get("/activityRecords/all")
			.set("token", token)
			.send({});

		expect(res.statusCode).toBe(200);
	});

	test("PUT /token", async () => {
		var noToken = await request(app)
			.put("/token")
			.set("token", token)
			.send({
				"oldToken": null,
				"newToken": "auth0|test1234"
			});

		expect(noToken.statusCode).toBe(400);

		var invalidToken = await request(app)
			.put("/token")
			.set("token", token)
			.send({
				"oldToken": token,
				"newToken": "test1234"
			});

		expect(invalidToken.statusCode).toBe(400);

		var res = await request(app)
			.put("/token")
			.set("token", token)
			.send({
				"oldToken": token,
				"newToken": "auth0|test1234"
			});

		expect(res.statusCode).toBe(200);
	});	

	test("DELETE /token", async () => {
		await request(app)
			.delete("/token/auth0|test1234")
			.expect(200);
	});});
