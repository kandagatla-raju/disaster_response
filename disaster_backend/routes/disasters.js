import express from 'express';
import { supabase } from '../supabase.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;
  const { data, error } = await supabase.from('disasters').insert([{ title, location_name, description, tags, owner_id }]).select();
  if (error) return res.status(500).json({ error: error.message });
  const io = req.app.get('io');
  io.emit('disaster_created', data[0]);
  res.status(201).json(data[0]);
});

router.get('/', async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('disasters').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('disasters').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
