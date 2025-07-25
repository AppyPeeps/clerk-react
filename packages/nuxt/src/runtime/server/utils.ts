import type { SignedInAuthObject, SignedOutAuthObject } from '@appypeeps/clerk-backend/internal';
import { makeAuthObjectSerializable, stripPrivateDataFromObject } from '@appypeeps/clerk-backend/internal';
import type { InitialState } from '@appypeeps/clerk-types';
import type { H3Event } from 'h3';
import { getRequestHeaders, getRequestProtocol } from 'h3';

/**
 * Converts an H3 event into a Fetch Request object.
 */
export function toWebRequest(event: H3Event) {
  const headers = getRequestHeaders(event) as HeadersInit;
  const protocol = getRequestProtocol(event);
  const dummyOriginReqUrl = new URL(event.node.req.url || '', `${protocol}://clerk-dummy`);
  return new Request(dummyOriginReqUrl, {
    method: event.method,
    headers: new Headers(headers),
  });
}

export function createInitialState(auth: SignedInAuthObject | SignedOutAuthObject) {
  const initialState = makeAuthObjectSerializable(stripPrivateDataFromObject(auth));
  return initialState as unknown as InitialState;
}
