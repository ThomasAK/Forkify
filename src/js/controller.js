import * as model from './model.js'
import recipeView from "./veiws/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime"
import SearchView from "./veiws/searchView";
import ResultsView from "./veiws/resultsView";
import PaginationView from "./veiws/paginationView";
import BookMarksView from "./veiws/bookMarksView";
import resultsView from "./veiws/resultsView";
import bookMarksView from "./veiws/bookMarksView";
import addRecipeView from "./veiws/addRecipeView";
import {MODAL_CLOSE_SEC} from "./config";


const controlRecipes = async function(){
  try{

    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage())

    // 1) Updating bookmarks
    bookMarksView.update(model.state.bookmarks)

    // 2) loading recipe
    await model.loadRecipe(id)
    console.log(model.state.recipe)

    // 3) rendering recipe
    recipeView.render(model.state.recipe)

  }catch (err){
    recipeView.renderError('We could not find that recipe. Please try another one!')
    console.error(err)
  }
}

const controlSearchResults = async function(){
  try{
    ResultsView.renderSpinner();
    // 1) Get search query
    const query = SearchView.getQuery()
    if(!query) return

    // 2) load results
    await model.loadSearchResults(query)

    // 3) Render results
    ResultsView.render(model.getSearchResultsPage())

    // 4) render pagination
    PaginationView.render(model.state.search)
  }catch (err){
    console.log(err)
  }
}

const controlPagination = function (goToPage){
  // 1) Render results
  ResultsView.render(model.getSearchResultsPage(goToPage))

  // 2) render pagination
  PaginationView.render(model.state.search)
}

const controlServings = function (newServings){
  // Update recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function (){
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // Update recipe view
  recipeView.update(model.state.recipe)

  // render bookmarks
  bookMarksView.render(model.state.bookmarks)
}

const controlBookmarks = function (){
  bookMarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe){
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookMarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // Close form window
    setTimeout(function (){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  }catch (err){
    console.error(err)
    addRecipeView.renderError(err.message)
  }
}

const init = function (){
  bookMarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  SearchView.addHandlerSearch(controlSearchResults)
  PaginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init();
