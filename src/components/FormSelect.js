import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap'

const Field = ({ meta, label, input, description, options, className, valueKey = '_id', displayKey = 'name' }) => {
  const Formcontrol = <FormControl componentClass='select' {...input}>
    <option value={null} />
    {options.map(item => <option key={item._id} value={item[valueKey]}>{item[displayKey]}</option>)}
  </FormControl>

  return (
    <FormGroup className={className}
      validationState={(meta.touched && meta.error) ? ('error') : undefined}>
      <ControlLabel>{label}</ControlLabel>
      {Formcontrol}
      <HelpBlock>
        {meta.touched && meta.error ? (
          <div>{meta.error}</div>
          ) : (
            <div>{description}</div>
          )
        }
      </HelpBlock>
    </FormGroup>
  )
}

Field.propTypes = {
  meta : React.PropTypes.object.isRequired,
  input : React.PropTypes.object.isRequired,
  label : React.PropTypes.string,
  options : React.PropTypes.array,
  description : React.PropTypes.string,
  type : React.PropTypes.string,
  className : React.PropTypes.string,
  displayKey : React.PropTypes.string,
  valueKey : React.PropTypes.string
}

export default Field
