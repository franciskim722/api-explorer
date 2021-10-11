import React, { useState } from 'react';
import { formatBodyState, parseBaseUrl, parseLabel } from './util'
import { BASE_URL, BODY, RESPONSE, SEND_REQUEST, SENDING, REQUIRED_FIELD_MISSING, REQUEST_FAILED } from './translations'
import './ExplorerComponent.css';

const VALID_RED_BODY_TYPES = ['POST', 'PUT']
const API_HEADERS = { "Content-type": "application/json; charset=UTF-8" }

function ExplorerComponent({ title, url, method, body }) {
  const [bodyState, setbodyState] = useState(formatBodyState(body))
  const [inFlightReq, setinFlightReq] = useState(false)
  const [errors, setErrors] = useState([])
  const [response, setResponse] = useState()

  const hasBodyObj = VALID_RED_BODY_TYPES.includes(method)

  const onInputChange = ({ target: { value } }, { name }) => {
    const updatedBody = { ...bodyState }
    updatedBody[name] = { ...updatedBody[name], value }
    setbodyState(updatedBody)
  }

  const validateForm = () => {
    const updatedErrors = []
    // Basic Form Validation
    // Check if value exists for fields and meet rules
    for (const field in bodyState) {
      const { required, value } = bodyState[field]
      // Check if field is required and if value is missing
      if (required && !value) {
        updatedErrors.push(REQUIRED_FIELD_MISSING)
      }
    }
    setErrors(updatedErrors)
    if (updatedErrors.length > 0) return setinFlightReq(false)
    return true
  }

  const sendRequest = async () => {
    // Remove unused keys from request body by filtering any obj keys that a value prop, then return a key-value pair
    const formattedBody = Object.keys(bodyState).filter(k => bodyState[k].value).reduce((obj, key) => {
      obj[key] = bodyState[key].value
      return obj
    }, {})

    await fetch(url, {
      method,
      headers: API_HEADERS, // Could customize this to input value by creating another state value
      body: JSON.stringify(formattedBody),
    })
      .then(response => response.json())
      .then(data => setResponse(JSON.stringify(data)))
      .catch(() => setErrors([REQUEST_FAILED]))
    setinFlightReq(false)
  }

  const submitForm = () => {
    setinFlightReq(true)
    // If request type has a body object and fields are not valid, end fn else send request to API
    if (hasBodyObj && !validateForm()) return
    sendRequest()
  }

  return (
    <div className='ctn'>
      {/* Title */}
      <h1>{title}</h1>
      <span className={`badge-${method}`}>{method}</span>
      {/* Url */}
      <h2>
        {BASE_URL}
      </h2>
      <span>
        {parseBaseUrl(url)}
      </span>
      {/* Body - Render if request type is POST/PUT */}
      {hasBodyObj && (
        <>
          <h2>{BODY}</h2>
          <form>
            {body.map(field => {
              const { name, required } = field
              return (
                <label key={name}>
                  {/* Label Name */}
                  <div>
                    {parseLabel(name)}
                    {/* Required Input CTA */}
                    {required && (<span className="required"> *</span>)}
                  </div>
                  <input {...field} onChange={(e) => onInputChange(e, field)} />
                </label>
              )
            })}
          </form>
        </>
      )}
      {/* Send Request Btn */}
      <div>
        <button type='button' onClick={submitForm}>{inFlightReq ? SENDING : SEND_REQUEST}</button>
      </div>
      {/* Error Messages */}
      {errors.map((e, i) => {
        return (
          <div key={`error-${i}`}>
            <span className="error">{e}</span>
          </div>
        )
      })}
      {/* Response Output */}
      <h2>{RESPONSE}</h2>
      <textarea readOnly value={response} />
    </div>
  )
}

export default ExplorerComponent
