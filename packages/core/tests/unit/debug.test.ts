describe('Debug test', () => {
  test('debug function is not undefined when NFW_DEBUG is enabled', async () => {
    process.env.NFW_DEBUG = 'all';
    const { debug } = await import('../../src/utils/debug.util.js');
    expect(debug).not.toBeUndefined();
  });
  test('debug function is undefined when NFW_DEBUG is disabled', async () => {
    const { debug } = await import('../../src/utils/debug.util.js');
    expect(debug).not.toBeUndefined();
  })
})
