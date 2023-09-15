import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductsManager.js";

const router = Router()
const productsService = new ProductsManager()

router.get("/", async (req, res) => {
  try {
    const {page = 1,limit = 10} = req.query
    const paginationResult = await productsService.getProducts(page,limit)
  
    const products = paginationResult.docs;
    const currentPage = paginationResult.page;
    const {hasPrevPage, hasNextPage, prevPage, nextPage} = paginationResult;
    const {user} = req.session

    let isUserRole = null

    if (user.role === "user") {
      isUserRole = true 
    }
 
    
    res.render("home",
     {
      user, 
      isUserRole,
      products,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
  });  
  } catch (error) {
    res.json({ error: error });
  }
});

router.get('/profile', async (req,res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    res.render('profile', {user: req.session.user})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/register', async (req,res) => {
  
  try {
    res.render('register', {})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/login', async (req,res) => {

  try {
    res.render('login',{})
  } catch (error) {
    res.json({ error: error });
  }
})

export default router