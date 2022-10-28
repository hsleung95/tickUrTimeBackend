const tokenService = require('../tokenService');

test('test create token', async () => {
	const res = await tokenService.createToken("guest|testToken");
	expect(res).toHaveProperty("token","guest|testToken");
});

test('test updateTokenTimestamp', async () => {
	const res = await tokenService.updateTokenTimestamp("guest|testToken");
	expect(res).toBeTruthy();
});
test('test replace token', async () => {
	const res = await tokenService.replaceToken("guest|testToken", "auth0|testNewToken");
	expect(res).toBeTruthy();
});

test('test deleteToken', async () => {
	const res = await tokenService.deleteToken("auth0|testNewToken");
	expect(res).toBeTruthy();
});
