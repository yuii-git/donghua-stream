/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Watch from './pages/Watch';
import Info from './pages/Info';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="detail/:slug" element={<Detail />} />
          <Route path="watch/:slug" element={<Watch />} />
          <Route path="info" element={<Info />} />
        </Route>
      </Routes>
    </Router>
  );
}

