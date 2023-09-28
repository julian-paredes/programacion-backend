import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductsManager.js";
import { getValidFilters } from "../services/getValidFilters.js";

const router = Router()
const productsService = new ProductsManager()

router.get("/", async (req, res) => {
  try {
    const {page = 1,limit = 10, sort, order, ...filters} = req.query    
    const cleanFilters = getValidFilters(filters,'product')
    let sortResult = {}
    if(sort){
      sortResult[sort] = order
    }
    const paginationResult = await productsService.paginateProducts(cleanFilters,{page,limit,lean:true,sort: sortResult})
    const products = paginationResult.docs;
    const currentPage = paginationResult.page;
    const {hasPrevPage, hasNextPage, prevPage, nextPage} = paginationResult;

    const baseUrl = `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}${req.baseUrl}`
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null

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
      nextPage,
      prevLink,
      nextLink
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

router.get('/loginJWT', async (req,res) => {

  try {
    res.render('loginjwt',{})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/profilejwt', async (req,res) => {
  try {
    res.render('profilejwt', {})
  } catch (error) {
    res.json({ error: error });
  }
})


export default router