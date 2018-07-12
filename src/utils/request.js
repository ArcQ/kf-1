import 'whatwg-fetch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

export const errorObserver = Observable.create(observer => {
  this.errorObserver = observer;
});

const esc = encodeURIComponent;
// const fetch = getFetch(); //in case for ssr

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function formQuery(data) {
  const query = Object.keys(data)
    .map((k) => `${esc(k)}=${esc(data[k])}`)
    .join('&');
  return `?${query}`;
}

export default function request(endpoint, body = {}, requestOptions = {}, customUrl) {
  let query = '';
  let path = endpoint;
  const apiUrl = customUrl || process.env.REACT_APP_API_URL;
  const defaults = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Version': process.env.REACT_APP_VERSION,
    },
    credentials: 'include',
  };
  const options = Object.assign({}, defaults, requestOptions);

  // Cut off leading slash
  if (path.charAt(0) === '/') path = path.slice(1);

  // Build query string or attach a body
  options.method = options.method.toUpperCase();
  if (options.method === 'GET' && body) {
    query = formQuery(body);
  } else if (options.method === 'POST' && body) {
    options.body = JSON.stringify(body);
  }

  const destination = `${apiUrl}/${path}${query}`;

  return fetch(destination, options)
    .then(checkStatus)
    .then((res) => res.json())
    .then((data) => ({ data }))
    .catch((error) => {
      errorObserver.next(error);
      return Observable.throw(error.json().error || 'Server error');
    });
}

// data$.subscribe(data => #<{(|do something with data|)}>#);
