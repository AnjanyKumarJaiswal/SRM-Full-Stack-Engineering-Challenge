import { Request, Response } from 'express';
import { GraphService } from '../services/graphService';
import { BFHLResponse } from '../types';

const USER_ID = 'anjanykumarjaiswal_01062001';
const EMAIL_ID = 'aj1899@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311026010006';

export const handleBFHL = (req: Request, res: Response): void => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      res.status(400).json({ error: 'Invalid input: data must be an array' });
      return;
    }

    const graphService = new GraphService();
    graphService.parseAndValidate(data);
    const hierarchies = graphService.process();

    const totalTrees = hierarchies.filter(h => !h.has_cycle).length;
    const totalCycles = hierarchies.filter(h => h.has_cycle).length;

    let largestTreeRoot = '';
    let largestDepth = 0;

    for (const h of hierarchies) {
      if (!h.has_cycle && h.depth !== undefined) {
        if (h.depth > largestDepth || (h.depth === largestDepth && h.root < largestTreeRoot)) {
          largestDepth = h.depth;
          largestTreeRoot = h.root;
        }
      }
    }

    const response: BFHLResponse = {
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      hierarchies,
      invalid_entries: graphService.getInvalidEntries(),
      duplicate_edges: graphService.getDuplicateEdges(),
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot,
      },
    };

    console.log(`[Scan Summary] Trees: ${totalTrees}, Cycles: ${totalCycles}, Root: ${largestTreeRoot}`);
    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};