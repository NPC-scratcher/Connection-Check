/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dashboard } from './components/Dashboard';
import { SupportWall } from './components/SupportWall';
import { useAccessControl } from './hooks/useAccessControl';

export default function App() {
  return <Dashboard />;
}
