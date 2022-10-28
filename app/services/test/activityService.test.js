const activityService = require('../activityService');

test('test create activity', async () => {
	const res = await activityService.createActivity({"id":"testing", "userId":"testToken"});
	expect(res).toBeTruthy();
});

test('test update activity', async () => {
	const res = await activityService.updateActivity("testing", {"name": "test name"});
	expect(res).toBeTruthy();
	const incorrect = await activityService.updateActivity("nosuchrecord", {"name": "test name"});
	expect(incorrect).toBeFalsy();
});

test('test getActivities', async () => {
	const res = await activityService.getActivities("testToken");
	expect(res).toHaveLength(1);
});

test('test replaceActivityToken', async () => {
	const res = await activityService.replaceActivityToken("testToken", "testNewToken");
	expect(res).toBeTruthy();
});


test('test deleteActivity', async () => {
	const res = await activityService.deleteActivity("testing");
	expect(res).toBeTruthy();
});
