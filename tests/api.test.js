import LeaderBoard from '../src/Objects/LeaderBoard';

const expectedResponse = {
  result: [
    {
      user: 'user1',
      score: 100,
    },
  ],
};

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve(expectedResponse),
}));

describe('test api', () => {
  test('expects API Key to be present', () => {
    const leaderboard = new LeaderBoard();
    const { Id } = leaderboard;
    expect(Id).toBe('d4R8GfuhT8Bv45Eq3aU5');
  });

  test('get results from API', () => {
    expect.assertions(1);
    const leaderboard = new LeaderBoard();
    return leaderboard.getLeaderBoard()
      .then(data => expect(data).toEqual(expectedResponse));
  });
});