const activityRecordService = require('../activityRecordService');

test('test createActivityRecord', async () => {
	const res = await activityRecordService.createActivityRecord({"id":"testing", "userId":"testToken"});
	expect(res).toBeTruthy();
});

test('test updateActivityRecord', async () => {
	const res = await activityRecordService.updateActivityRecord("testing", {"name": "test name"});
	expect(res).toBeTruthy();
	const incorrect = await activityRecordService.updateActivityRecord("nosuchrecord", {"name": "test name"});
	expect(incorrect).toBeFalsy();
});

test('test getActivityRecords', async () => {
	const res = await activityRecordService.getActivityRecords("testToken");
	expect(res).toHaveLength(1);
});

test('test replaceActivityRecordToken', async () => {
	const res = await activityRecordService.replaceActivityRecordToken("testToken", "testNewToken");
	expect(res).toBeTruthy();
});


test('test deleteActivityRecord', async () => {
	const res = await activityRecordService.deleteActivityRecord("testing");
	expect(res).toBeTruthy();
});
