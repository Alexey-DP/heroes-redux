import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import { deleteHero, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroList.scss';

const HeroesList = () => {

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const { heroesLoadingStatus } = useSelector(state => state.heroes);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const onDeleteHero = (id) => {

        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(deleteHero(id)))
            .catch(err => console.log(err.message));
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <CSSTransition
            timeout={0}
            classNames="hero"
            >
                <h5 className="text-center mt-5">Героев пока нет</h5>
            </CSSTransition>
        }

        return arr.map(({id, ...props}) => {
            return <CSSTransition
            key={id}
            classNames="hero__animate"
            timeout={500}
            tabIndex={0}>
                <HeroesListItem
            onDeleteHero={() => onDeleteHero(id)} {...props}/>
            </CSSTransition>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;