import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
const router = express.Router();

router.get('/:id/official-updates', async (req, res) => {
  try {
    const baseUrl = 'https://ndma.gov.in';
    const { data: html } = await axios.get(baseUrl);
    const $ = cheerio.load(html);
    const updates = [];

    $('a').each((_, el) => {
      const text = $(el).text().trim();
      let href = $(el).attr('href');
      if (!href || !text) return;
      if (!href.startsWith('http')) {
        href = `${baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
      }
      if (text.toLowerCase().includes('flood') || text.toLowerCase().includes('cyclone') || text.toLowerCase().includes('alert') || text.toLowerCase().includes('disaster')) {
        updates.push({ title: text, link: href });
      }
    });

    res.json({ updates: updates.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch official updates' });
  }
});

export default router;
