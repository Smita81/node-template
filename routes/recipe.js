import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import recipeControllers from '../controllers/recipe.js';

const router = express.Router();

// Public routes
router.get('/recipes', recipeControllers.getAllRecipes);
router.get('/recipes/:id', recipeControllers.getOneRecipe);

// Protected routes (require authentication)
router.post('/recipes', verifyToken, recipeControllers.postRecipe);
router.put('/recipes/:id', verifyToken, recipeControllers.updateRecipe);
router.delete('/recipes/:id', verifyToken, recipeControllers.deleteRecipe);

export default router;
