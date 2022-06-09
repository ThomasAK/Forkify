import * as model from './model.js'
import recipeView from "./veiws/recipeView.js";

import icons from 'url:../img/icons.svg'
import "core-js/stable";
import "regenerator-runtime/runtime"
import SearchView from "./veiws/searchView";
import searchView from "./veiws/searchView";

const controlRecipes = async function(){
  try{

    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1) loading recipe
    await model.loadRecipe(id)
    console.log(model.state.recipe)

    // 2) rendering recipe
    recipeView.render(model.state.recipe)

  }catch (err){
    recipeView.renderError('We could not find that recipe. Please try another one!')
  }
}

const controlSearchResults = async function(){
  try{
    // 1) Get search query
    const query = SearchView.getQuery()
    if(!query) return

    // 2) load results
    await model.loadSearchResults(query)
  }catch (err){
    console.log(err)
  }
}

const init = function (){
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}
init();
