jest.mock('@/lib/apiClient', () => ({
    __esModule: true,
    default: {
        defaults: {
            headers: {
                common: {} as Record<string, string>,
            },
        },
    },
}));

jest.mock('nookies', () => ({
    setCookie: jest.fn(),
    destroyCookie: jest.fn(),
}));

jest.mock('react-ga', () => ({
    __esModule: true,
    default: {
        initialize: jest.fn(),
        set: jest.fn(),
        pageview: jest.fn(),
        event: jest.fn(),
        exception: jest.fn(),
    },
}));

import { destroyCookie, setCookie } from 'nookies';
import ReactGA from 'react-ga';

import apiClient from '@/lib/apiClient';
import { autoLogin, autoLogout, deleteAuthToken, setAuthToken } from '@/utils/auth';
import { initGA, logEvent, logException, logPageView } from '@/utils/analytics';

const mockReactGA = (ReactGA as unknown) as {
    initialize: jest.Mock;
    set: jest.Mock;
    pageview: jest.Mock;
    event: jest.Mock;
    exception: jest.Mock;
};

const mockApiClient = apiClient as {
    defaults: {
        headers: {
            common: Record<string, string>;
        };
    };
};

describe('auth utils', () => {
    beforeEach(() => {
        mockApiClient.defaults.headers.common = {};
        jest.clearAllMocks();
    });

    test('setAuthToken sets the authorization header', () => {
        setAuthToken('abc123');

        expect(mockApiClient.defaults.headers.common.Authorization).toBe('Bearer abc123');
    });

    test('deleteAuthToken removes the authorization header', () => {
        mockApiClient.defaults.headers.common.Authorization = 'Bearer token';

        deleteAuthToken();

        expect(mockApiClient.defaults.headers.common.Authorization).toBeUndefined();
    });

    test('autoLogin stores cookie and sets header', () => {
        autoLogin('token-1');

        expect(setCookie).toHaveBeenCalledWith({}, 'token', 'token-1', {});
        expect(mockApiClient.defaults.headers.common.Authorization).toBe('Bearer token-1');
    });

    test('autoLogout clears cookie and header', () => {
        mockApiClient.defaults.headers.common.Authorization = 'Bearer token-2';

        autoLogout();

        expect(destroyCookie).toHaveBeenCalledWith({}, 'token');
        expect(mockApiClient.defaults.headers.common.Authorization).toBeUndefined();
    });
});

describe('analytics utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('initGA initializes ReactGA', () => {
        initGA();

        expect(mockReactGA.initialize).toHaveBeenCalledWith('UA-145462597-3');
    });

    test('logPageView records the current pathname', () => {
        logPageView();

        expect(mockReactGA.set).toHaveBeenCalledWith({ page: window.location.pathname });
        expect(mockReactGA.pageview).toHaveBeenCalledWith(window.location.pathname);
    });

    test('logEvent and logException forward analytic events', () => {
        logEvent('cart', 'add');
        logException('broken', true);

        expect(mockReactGA.event).toHaveBeenCalledWith({ category: 'cart', action: 'add' });
        expect(mockReactGA.exception).toHaveBeenCalledWith({ description: 'broken', fatal: true });
    });

    test('logEvent ignores incomplete payloads and logException ignores empty descriptions', () => {
        logEvent('', 'add');
        logEvent('cart', '');
        logException('');

        expect(mockReactGA.event).not.toHaveBeenCalled();
        expect(mockReactGA.exception).not.toHaveBeenCalled();
    });
});
