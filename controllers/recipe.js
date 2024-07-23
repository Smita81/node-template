import query from '../config/db.js';

const recipeControllers = {
    getAllRecipes: async (req, res) => {
        try {
            const recipes = await query('SELECT * FROM recipes');
            res.status(200).json(recipes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getOneRecipe: async (req, res) => {
        const { id } = req.params;

        try {
            const [recipe] = await query('SELECT * FROM recipes WHERE id = ?', [id]);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.status(200).json(recipe);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    postRecipe: async (req, res) => {
        const { title, ingredients, instructions } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const result = await query('INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)', [title, ingredients, instructions]);
            res.status(201).json({ message: 'Recipe created successfully', recipeId: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    updateRecipe: async (req, res) => {
        const { id } = req.params;
        const { title, ingredients, instructions } = req.body;

        try {
            const [recipe] = await query('SELECT * FROM recipes WHERE id = ?', [id]);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            const updatedTitle = title || recipe.title;
            const updatedIngredients = ingredients || recipe.ingredients;
            const updatedInstructions = instructions || recipe.instructions;

            await query('UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?', [updatedTitle, updatedIngredients, updatedInstructions, id]);
            res.status(200).json({ message: 'Recipe updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    deleteRecipe: async (req, res) => {
        const { id } = req.params;

        try {
            const [recipe] = await query('SELECT * FROM recipes WHERE id = ?', [id]);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            await query('DELETE FROM recipes WHERE id = ?', [id]);
            res.status(200).json({ message: 'Recipe deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },
};

export default recipeControllers;
