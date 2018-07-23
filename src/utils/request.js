import 'whatwg-fetch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

const DEFAULT_API_URL = 'http://localhost:7000';

let errorObserver;

export const errorObservable$ = Observable.create(observer => {
  errorObserver = observer;
});

errorObservable$.subscribe((e) => console.log(e))

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
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');
  return `?${query}`;
}

export default function request(endpoint, body = {}, requestOptions = {}, customUrl) {
  let query = '';
  let path = endpoint;
  const apiUrl = customUrl || DEFAULT_API_URL || process.env.REACT_APP_API_URL;
  const defaults = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
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
  return Observable.create(observer => {
    fetch(destination, options)
      .then(checkStatus)
      .then((res) => res.json())
      .then((data) => ({ data }))
      .catch((error) => {
        errorObserver.next(error);
        return Observable.throw(error || 'Server error');
      });
  });
}

// data$.subscribe(data => #<{(|do something with data|)}>#);
