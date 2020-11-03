// TODO: Needs babel config in parent dir, that currently messes with the build
// process so I deleted it.
// TODO: Get mock working for ethers so we don't make real calls during tests.

import Venus from '../src/index';

test('Venus constructor', async () => {
  const venus = new Venus('http://3.10.133.254:8575');

  console.log(venus.keys);
  expect(venus).toBe(true);
});
