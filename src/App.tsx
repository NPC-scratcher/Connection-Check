/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dashboard } from './components/Dashboard';
import { AdWall } from './components/AdWall';
import { useAccessControl } from './hooks/useAccessControl';

export default function App() {
  const { hasAccess, isTrial, timeLeft, grantAccess } = useAccessControl();

  return (
    <>
      {!hasAccess && <AdWall onUnlock={grantAccess} />}
      <Dashboard isTrial={isTrial} timeLeft={timeLeft} />
    </>
  );
}
