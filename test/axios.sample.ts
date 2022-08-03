import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5050';

const TEST_PROJECT_ID = 'Your Project Id';

export { axios, TEST_PROJECT_ID };
