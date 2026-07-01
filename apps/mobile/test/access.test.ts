import assert from 'node:assert/strict';
import test from 'node:test';
import { canAccessRole, getSessionSnapshot } from '../src/auth/access';

test('the scaffold starts without an authenticated session', () => {
  assert.equal(getSessionSnapshot(), null);
});

test('unauthenticated users cannot enter protected roles', () => {
  assert.equal(canAccessRole(null, 'participant'), false);
  assert.equal(canAccessRole(null, 'researcher'), false);
});

test('roles cannot cross into the other protected route group', () => {
  assert.equal(canAccessRole({ role: 'participant' }, 'researcher'), false);
  assert.equal(canAccessRole({ role: 'researcher' }, 'participant'), false);
});
