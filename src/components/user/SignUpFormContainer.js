import SignUpForm from './SignUpForm'
import { resetValidateUserFields } from './actions';
import {fetchCountries,fetchCountriesSuccess, fetchCountriesFailure,fetchCities,fetchCitiesSuccess, fetchCitiesFailure,
    geocoder, geocoderSuccess, geocoderFailure,
    fetchPaymentTypes, fetchPaymentTypesSuccess, fetchPaymentTypesFailure,
} from '../objectmain/actions'
import { connect } from 'react-redux'



const mapDispatchToProps = (dispatch) => {
    return {
        resetMe: () => {
            dispatch(resetValidateUserFields());
        },
        fetchCountries: () => {
            dispatch(fetchCountries())
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && (result.payload.response.status !== 200 || result.error)) {
                        dispatch(fetchCountriesFailure(result.payload.response.data || result.payload));
                    } else {
                        dispatch(fetchCountriesSuccess(result.payload.data));
                        dispatch(fetchCities(result.payload.data[0].ID))
                            .then((result) => {
                                // Note: Error's "data" is in result.payload.response.data (inside "response")
                                // success's "data" is in result.payload.data
                                if (result.payload.response && result.payload.response.status !== 200) {
                                    dispatch(fetchCitiesFailure(result.payload.response.data));
                                } else {
                                    dispatch(fetchCitiesSuccess(result.payload.data))
                                }
                            })
                    }
                })
        },
        fetchCities: (countryId) => {
            dispatch(fetchCities(countryId))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchCitiesFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchCitiesSuccess(result.payload.data))
                    }
                })
        },
        fetchPaymentTypes: (iblockId) => {
            dispatch(fetchPaymentTypes(iblockId))
                .then((result) => {
                    // Note: Error's "data" is in result.payload.response.data (inside "response")
                    // success's "data" is in result.payload.data
                    if (result.payload.response && result.payload.response.status !== 200) {
                        dispatch(fetchPaymentTypesFailure(result.payload.response.data));
                    } else {
                        dispatch(fetchPaymentTypesSuccess(result.payload.data))
                    }
                })
        },
        goGeocoder: (geocode) => {
            return dispatch(geocoder(geocode))
                .then((result) => {
                    if (result.payload.response && result.payload.response.status !== 200) {
                        return dispatch(geocoderFailure(result.payload.response.data));
                    } else {
                        return dispatch(geocoderSuccess(result.payload.data))
                    }
                } )
        }
    }
}


function mapStateToProps(state, ownProps) {
  // const responseCities = state.activeObject.cities
  // let cities = []
  // for(let c of responseCities){
  //   cities.filter(city => city['NAME'] === c.NAME){
  //
  //   }
  // }
  return {
      user: state.user,
//      validateFields: state.validateFields,
      countries:state.activeObject && state.activeObject.countries,
      cities:state.activeObject && state.activeObject.cities,
      geocoder:state.activeObject && state.activeObject.geocoder,
      initialValues: {
          country: state.activeObject && state.activeObject.countries && state.activeObject.countries[0] && state.activeObject.countries[0].ID
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
