import { fetchUtils, type DataProvider } from 'react-admin';

const apiUrl = 'http://localhost:8080/api/admin';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('adminToken');
    if (token) {
        (options.headers as Headers).set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider: DataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query = new URLSearchParams({
            page: (page - 1).toString(),
            size: perPage.toString(),
            sort: `${field},${order}`
        });
        const url = `${apiUrl}/${resource}?${query.toString()}`;

        return httpClient(url).then(({ json }) => ({
            data: json.content,
            total: json.totalElements,
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        return Promise.reject('getMany not implemented yet');
    },

    getManyReference: (resource, params) => {
        return Promise.reject('getManyReference not implemented yet');
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: params.data })),

    updateMany: (resource, params) => {
        return Promise.reject('updateMany not implemented yet');
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        return Promise.reject('deleteMany not implemented yet');
    },
};
