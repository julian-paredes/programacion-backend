import BaseRouter from "./BaseRouter.js";
import ProductsManager from "../dao/mongo/managers/ProductsManager.js";
import { getValidFilters } from "../services/getValidFilters.js";


const productsService = new ProductsManager()

class newViewsRouter extends BaseRouter {

    init(){

        this.get("/",['PUBLIC'], async (req, res) => {
            try {
              console.log(req.user);
              const {page = 1,limit = 10, sort, order, ...filters} = req.query    
              const cleanFilters = getValidFilters (filters,'product')
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
          
              const {user} = req
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
              console.log(error);
            }
          });

        this.get('/profile',['AUTH'], async (req,res) => {
            try {
              if (!req.user) {
                return res.redirect('/login')
              }
              res.render('profile', {user: req.user})
            } catch (error) {
              res.json({ error: error });
            }
          })

        this.get('/register',['NO_AUTH'], async (req,res) => {
  
            try {
              res.render('register')
            } catch (error) {
              res.json({ error: error });
            }
          })

        this.get('/login',['NO_AUTH'], async (req,res) => {

            try {
              res.render('login')
            } catch (error) {
              res.json({ error: error });
            }
          })
    }
}

const viewsRouter = new newViewsRouter()

export default viewsRouter.getRouter()