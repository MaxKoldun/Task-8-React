import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Image, Grid, Segment } from 'semantic-ui-react';
import { fetchAllRecipes, deleteRecipe } from './RecipesActions';
import { allRecipes, isRecipesFetching } from './RecipesReducer';
import logo from '../../assets/logo.png';
import RecipeList from '../../components/RecipeList/RecipeList';
import RecipeListHeader from '../../components/RecipeList/RecipeListHeader';
import EmptyRecipeList from '../../components/RecipeList/EmptyRecipeList';
import RecipeModal from '../../components/RecipeModal/RecipeModal';
import './Recipes.css';

class Recipes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeRecipe: null,
            searchValue: ''
        };
    }

    componentDidMount() {
        this.props.actions.fetchAllRecipes();
    }

    setSearchValue = searchLetter => {
        this.setState({
            searchValue: searchLetter
        })
    }

    handleDelete = (id) => {
        this.props.actions.deleteRecipe(id);
    }

    handleEdit = id => {
        this.props.history.push(`/recipes/${id}`);
    }

    handleRecipeCreate = () => {
        this.props.history.push(`/recipes/new`);
    }

    toggleRecipeModal = id => {
        this.setState({
            activeRecipe: this.props.allRecipes.find(r => r._id === id)
        })
    }

    handleModalClose = () => {
        this.toggleRecipeModal(null);
    }

    filterList = (searchValue, allRecipes) => {
        var filteredList = [];
        
        if(searchValue) {
            for (let i = 0; i < allRecipes.length; i++) {
                let a = allRecipes[i];
                if (a.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) {
                    filteredList.push(allRecipes[i]);
                }
            }
            return filteredList;   
        } else {
            return allRecipes
        }            
    }

    showState = () => {
        console.log(this.state.searchValue);
    }

    render() {
        const { isFetching, allRecipes } = this.props;
        const { activeRecipe, searchValue } = this.state;
        
        let filteredMassiveOfRecipes = this.filterList(searchValue, allRecipes);
        console.log(filteredMassiveOfRecipes);
        return (<Container>
            <Grid centered columns={1}>
                <Grid.Column>
                    <Image src={logo} centered />
                </Grid.Column>
                <Grid.Row>
                    <Grid.Column>
                        <Segment raised padded textAlign="center" loading={isFetching}>
                            {!allRecipes.length && !isFetching
                                ? <EmptyRecipeList 
                                    onCreate={this.handleRecipeCreate} 
                                />
                                : <React.Fragment>
                                    <RecipeListHeader 
                                        onCreate={this.handleRecipeCreate} 
                                        listLength={allRecipes.length} 
                                        onChange={this.setSearchValue}
                                    />
                                    <RecipeList
                                        recipes={filteredMassiveOfRecipes} 
                                        onView={this.toggleRecipeModal} 
                                        onDelete={this.handleDelete} 
                                        onEdit={this.handleEdit}
                                    />
                                </React.Fragment>
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <RecipeModal 
                recipe={activeRecipe} 
                onClose={this.handleModalClose} 
            />
        </Container>)
    }
}

Recipes.propTypes = {
    allRecipes: PropTypes.array,
    isFetching: PropTypes.bool,
    actions: PropTypes.object
}
const mapStateToProps = state => ({
    allRecipes: allRecipes(state),
    isFetching: isRecipesFetching(state)
});


const mapDispatchToProps =  dispatch => ({
    actions: bindActionCreators({fetchAllRecipes, deleteRecipe}, dispatch)
});

export default connect(mapStateToProps,  mapDispatchToProps)(Recipes);
