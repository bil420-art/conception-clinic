var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, p as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, q as lookupResultToBuffer, s as RequestStatusResponseStatus, U as UnknownError, t as RequestStatusDoneNoReplyErrorCode, v as RejectError, w as CertifiedRejectErrorCode, x as UNREACHABLE_ERROR, I as InputError, y as InvalidReadStateRequestErrorCode, z as ReadRequestType, A as Principal, D as IDL, F as MissingCanisterIdErrorCode, H as HttpAgent, G as encode, Q as QueryResponseStatus, J as UncertifiedRejectErrorCode, K as isV3ResponseBody, N as isV2ResponseBody, O as UncertifiedRejectUpdateErrorCode, V as UnexpectedErrorCode, W as decode, Y as Subscribable, Z as pendingThenable, _ as resolveEnabled, $ as shallowEqualObjects, a0 as resolveStaleTime, a1 as noop, a2 as environmentManager, a3 as isValidTimeout, a4 as timeUntilStale, a5 as timeoutManager, a6 as focusManager, a7 as fetchState, a8 as replaceData, a9 as notifyManager, aa as hashKey, ab as getDefaultState, r as reactExports, ac as shouldThrowError, ad as useQueryClient, ae as useInternetIdentity, af as createActorWithConfig, ag as Record, ah as Variant, ai as Vec, aj as Opt, ak as Service, al as Func, am as Nat, an as Text, ao as Null, ap as Int, aq as Principal$1, ar as Bool } from "./index-DAu_OpgI.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const SlotId = Nat;
const BookAppointmentRequest = Record({
  "reasonForVisit": Text,
  "name": Text,
  "email": Text,
  "slotId": SlotId,
  "phone": Text
});
const AppointmentId = Nat;
const AppointmentStatus$1 = Variant({
  "cancelled": Null,
  "pending": Null,
  "confirmed": Null
});
const UserId = Principal$1;
const Timestamp = Int;
const Appointment = Record({
  "id": AppointmentId,
  "status": AppointmentStatus$1,
  "reasonForVisit": Text,
  "userId": UserId,
  "name": Text,
  "createdAt": Timestamp,
  "email": Text,
  "slotId": SlotId,
  "slotStartTime": Timestamp,
  "phone": Text
});
const ArticleCategory$1 = Variant({
  "reproductiveTesting": Null,
  "stress": Null,
  "sexualHealth": Null,
  "general": Null,
  "lifestyle": Null,
  "nutrition": Null
});
const Citation = Record({
  "title": Text,
  "source": Text,
  "year": Nat,
  "authors": Text
});
const CreateArticleRequest = Record({
  "title": Text,
  "content": Text,
  "category": ArticleCategory$1,
  "citations": Vec(Citation)
});
const ArticleId = Nat;
const ArticlePublic = Record({
  "id": ArticleId,
  "title": Text,
  "content": Text,
  "publishedAt": Timestamp,
  "updatedAt": Timestamp,
  "category": ArticleCategory$1,
  "citations": Vec(Citation)
});
const BlogPostStatus$1 = Variant({
  "published": Null,
  "draft": Null
});
const CreateBlogPostRequest = Record({
  "status": BlogPostStatus$1,
  "title": Text,
  "content": Text,
  "featuredImageUrl": Opt(Text),
  "excerpt": Text
});
const BlogPostPublic = Record({
  "id": Nat,
  "status": BlogPostStatus$1,
  "title": Text,
  "content": Text,
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "featuredImageUrl": Opt(Text),
  "excerpt": Text
});
const AssessmentId = Nat;
const AnswerValue = Variant({
  "nat": Nat,
  "bool": Bool,
  "text": Text
});
const QuestionId = Nat;
const Answer = Record({
  "value": AnswerValue,
  "questionId": QuestionId
});
const Recommendation = Record({
  "title": Text,
  "description": Text,
  "category": Text
});
const RiskLevel$1 = Variant({
  "areasToImprove": Null,
  "optimized": Null,
  "consultSpecialist": Null
});
const RiskProfile = Record({
  "completedAt": Timestamp,
  "recommendations": Vec(Recommendation),
  "overallRisk": RiskLevel$1
});
const Assessment = Record({
  "id": AssessmentId,
  "userId": UserId,
  "answers": Vec(Answer),
  "createdAt": Timestamp,
  "riskProfile": RiskProfile
});
const PlanningTimeline = Variant({
  "within1Year": Null,
  "moreThan1Year": Null,
  "notSure": Null,
  "within3Months": Null,
  "within6Months": Null
});
const UserProfilePublic = Record({
  "id": UserId,
  "age": Opt(Nat),
  "healthHistoryConsent": Bool,
  "planningTimeline": Opt(PlanningTimeline),
  "displayName": Text,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
});
const ConsultationSlot = Record({
  "id": SlotId,
  "startTime": Timestamp,
  "isAvailable": Bool,
  "durationMinutes": Nat
});
const SubmitAssessmentRequest = Record({
  "answers": Vec(Answer)
});
const UpdateBlogPostRequest = Record({
  "id": Nat,
  "status": BlogPostStatus$1,
  "title": Text,
  "content": Text,
  "featuredImageUrl": Opt(Text),
  "excerpt": Text
});
const UpdateProfileRequest = Record({
  "age": Opt(Nat),
  "healthHistoryConsent": Bool,
  "planningTimeline": Opt(PlanningTimeline),
  "displayName": Text
});
Service({
  "bookAppointment": Func([BookAppointmentRequest], [Appointment], []),
  "canRetakeAssessment": Func([], [Bool], ["query"]),
  "cancelAppointment": Func([AppointmentId], [Bool], []),
  "createArticle": Func([CreateArticleRequest], [ArticlePublic], []),
  "createBlogPost": Func([CreateBlogPostRequest], [BlogPostPublic], []),
  "deleteBlogPost": Func([Nat], [Bool], []),
  "getArticle": Func([ArticleId], [Opt(ArticlePublic)], ["query"]),
  "getBlogPost": Func([Nat], [Opt(BlogPostPublic)], ["query"]),
  "getMyAppointments": Func([], [Vec(Appointment)], ["query"]),
  "getMyLatestAssessment": Func([], [Opt(Assessment)], ["query"]),
  "getMyProfile": Func([], [Opt(UserProfilePublic)], ["query"]),
  "listAllBlogPosts": Func([], [Vec(BlogPostPublic)], ["query"]),
  "listArticles": Func([], [Vec(ArticlePublic)], ["query"]),
  "listArticlesByCategory": Func(
    [ArticleCategory$1],
    [Vec(ArticlePublic)],
    ["query"]
  ),
  "listAvailableSlots": Func([], [Vec(ConsultationSlot)], ["query"]),
  "listPublishedBlogPosts": Func([], [Vec(BlogPostPublic)], ["query"]),
  "submitAssessment": Func([SubmitAssessmentRequest], [Assessment], []),
  "updateBlogPost": Func(
    [UpdateBlogPostRequest],
    [Opt(BlogPostPublic)],
    []
  ),
  "upsertMyProfile": Func([UpdateProfileRequest], [UserProfilePublic], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const SlotId2 = IDL2.Nat;
  const BookAppointmentRequest2 = IDL2.Record({
    "reasonForVisit": IDL2.Text,
    "name": IDL2.Text,
    "email": IDL2.Text,
    "slotId": SlotId2,
    "phone": IDL2.Text
  });
  const AppointmentId2 = IDL2.Nat;
  const AppointmentStatus2 = IDL2.Variant({
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "confirmed": IDL2.Null
  });
  const UserId2 = IDL2.Principal;
  const Timestamp2 = IDL2.Int;
  const Appointment2 = IDL2.Record({
    "id": AppointmentId2,
    "status": AppointmentStatus2,
    "reasonForVisit": IDL2.Text,
    "userId": UserId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "email": IDL2.Text,
    "slotId": SlotId2,
    "slotStartTime": Timestamp2,
    "phone": IDL2.Text
  });
  const ArticleCategory2 = IDL2.Variant({
    "reproductiveTesting": IDL2.Null,
    "stress": IDL2.Null,
    "sexualHealth": IDL2.Null,
    "general": IDL2.Null,
    "lifestyle": IDL2.Null,
    "nutrition": IDL2.Null
  });
  const Citation2 = IDL2.Record({
    "title": IDL2.Text,
    "source": IDL2.Text,
    "year": IDL2.Nat,
    "authors": IDL2.Text
  });
  const CreateArticleRequest2 = IDL2.Record({
    "title": IDL2.Text,
    "content": IDL2.Text,
    "category": ArticleCategory2,
    "citations": IDL2.Vec(Citation2)
  });
  const ArticleId2 = IDL2.Nat;
  const ArticlePublic2 = IDL2.Record({
    "id": ArticleId2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "publishedAt": Timestamp2,
    "updatedAt": Timestamp2,
    "category": ArticleCategory2,
    "citations": IDL2.Vec(Citation2)
  });
  const BlogPostStatus2 = IDL2.Variant({
    "published": IDL2.Null,
    "draft": IDL2.Null
  });
  const CreateBlogPostRequest2 = IDL2.Record({
    "status": BlogPostStatus2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "featuredImageUrl": IDL2.Opt(IDL2.Text),
    "excerpt": IDL2.Text
  });
  const BlogPostPublic2 = IDL2.Record({
    "id": IDL2.Nat,
    "status": BlogPostStatus2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "createdAt": Timestamp2,
    "updatedAt": Timestamp2,
    "featuredImageUrl": IDL2.Opt(IDL2.Text),
    "excerpt": IDL2.Text
  });
  const AssessmentId2 = IDL2.Nat;
  const AnswerValue2 = IDL2.Variant({
    "nat": IDL2.Nat,
    "bool": IDL2.Bool,
    "text": IDL2.Text
  });
  const QuestionId2 = IDL2.Nat;
  const Answer2 = IDL2.Record({
    "value": AnswerValue2,
    "questionId": QuestionId2
  });
  const Recommendation2 = IDL2.Record({
    "title": IDL2.Text,
    "description": IDL2.Text,
    "category": IDL2.Text
  });
  const RiskLevel2 = IDL2.Variant({
    "areasToImprove": IDL2.Null,
    "optimized": IDL2.Null,
    "consultSpecialist": IDL2.Null
  });
  const RiskProfile2 = IDL2.Record({
    "completedAt": Timestamp2,
    "recommendations": IDL2.Vec(Recommendation2),
    "overallRisk": RiskLevel2
  });
  const Assessment2 = IDL2.Record({
    "id": AssessmentId2,
    "userId": UserId2,
    "answers": IDL2.Vec(Answer2),
    "createdAt": Timestamp2,
    "riskProfile": RiskProfile2
  });
  const PlanningTimeline2 = IDL2.Variant({
    "within1Year": IDL2.Null,
    "moreThan1Year": IDL2.Null,
    "notSure": IDL2.Null,
    "within3Months": IDL2.Null,
    "within6Months": IDL2.Null
  });
  const UserProfilePublic2 = IDL2.Record({
    "id": UserId2,
    "age": IDL2.Opt(IDL2.Nat),
    "healthHistoryConsent": IDL2.Bool,
    "planningTimeline": IDL2.Opt(PlanningTimeline2),
    "displayName": IDL2.Text,
    "createdAt": Timestamp2,
    "updatedAt": Timestamp2
  });
  const ConsultationSlot2 = IDL2.Record({
    "id": SlotId2,
    "startTime": Timestamp2,
    "isAvailable": IDL2.Bool,
    "durationMinutes": IDL2.Nat
  });
  const SubmitAssessmentRequest2 = IDL2.Record({ "answers": IDL2.Vec(Answer2) });
  const UpdateBlogPostRequest2 = IDL2.Record({
    "id": IDL2.Nat,
    "status": BlogPostStatus2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "featuredImageUrl": IDL2.Opt(IDL2.Text),
    "excerpt": IDL2.Text
  });
  const UpdateProfileRequest2 = IDL2.Record({
    "age": IDL2.Opt(IDL2.Nat),
    "healthHistoryConsent": IDL2.Bool,
    "planningTimeline": IDL2.Opt(PlanningTimeline2),
    "displayName": IDL2.Text
  });
  return IDL2.Service({
    "bookAppointment": IDL2.Func([BookAppointmentRequest2], [Appointment2], []),
    "canRetakeAssessment": IDL2.Func([], [IDL2.Bool], ["query"]),
    "cancelAppointment": IDL2.Func([AppointmentId2], [IDL2.Bool], []),
    "createArticle": IDL2.Func([CreateArticleRequest2], [ArticlePublic2], []),
    "createBlogPost": IDL2.Func([CreateBlogPostRequest2], [BlogPostPublic2], []),
    "deleteBlogPost": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "getArticle": IDL2.Func([ArticleId2], [IDL2.Opt(ArticlePublic2)], ["query"]),
    "getBlogPost": IDL2.Func([IDL2.Nat], [IDL2.Opt(BlogPostPublic2)], ["query"]),
    "getMyAppointments": IDL2.Func([], [IDL2.Vec(Appointment2)], ["query"]),
    "getMyLatestAssessment": IDL2.Func([], [IDL2.Opt(Assessment2)], ["query"]),
    "getMyProfile": IDL2.Func([], [IDL2.Opt(UserProfilePublic2)], ["query"]),
    "listAllBlogPosts": IDL2.Func([], [IDL2.Vec(BlogPostPublic2)], ["query"]),
    "listArticles": IDL2.Func([], [IDL2.Vec(ArticlePublic2)], ["query"]),
    "listArticlesByCategory": IDL2.Func(
      [ArticleCategory2],
      [IDL2.Vec(ArticlePublic2)],
      ["query"]
    ),
    "listAvailableSlots": IDL2.Func([], [IDL2.Vec(ConsultationSlot2)], ["query"]),
    "listPublishedBlogPosts": IDL2.Func(
      [],
      [IDL2.Vec(BlogPostPublic2)],
      ["query"]
    ),
    "submitAssessment": IDL2.Func([SubmitAssessmentRequest2], [Assessment2], []),
    "updateBlogPost": IDL2.Func(
      [UpdateBlogPostRequest2],
      [IDL2.Opt(BlogPostPublic2)],
      []
    ),
    "upsertMyProfile": IDL2.Func(
      [UpdateProfileRequest2],
      [UserProfilePublic2],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var AppointmentStatus = /* @__PURE__ */ ((AppointmentStatus2) => {
  AppointmentStatus2["cancelled"] = "cancelled";
  AppointmentStatus2["pending"] = "pending";
  AppointmentStatus2["confirmed"] = "confirmed";
  return AppointmentStatus2;
})(AppointmentStatus || {});
var ArticleCategory = /* @__PURE__ */ ((ArticleCategory2) => {
  ArticleCategory2["reproductiveTesting"] = "reproductiveTesting";
  ArticleCategory2["stress"] = "stress";
  ArticleCategory2["sexualHealth"] = "sexualHealth";
  ArticleCategory2["general"] = "general";
  ArticleCategory2["lifestyle"] = "lifestyle";
  ArticleCategory2["nutrition"] = "nutrition";
  return ArticleCategory2;
})(ArticleCategory || {});
var BlogPostStatus = /* @__PURE__ */ ((BlogPostStatus2) => {
  BlogPostStatus2["published"] = "published";
  BlogPostStatus2["draft"] = "draft";
  return BlogPostStatus2;
})(BlogPostStatus || {});
var RiskLevel = /* @__PURE__ */ ((RiskLevel2) => {
  RiskLevel2["areasToImprove"] = "areasToImprove";
  RiskLevel2["optimized"] = "optimized";
  RiskLevel2["consultSpecialist"] = "consultSpecialist";
  return RiskLevel2;
})(RiskLevel || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async bookAppointment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.bookAppointment(arg0);
        return from_candid_Appointment_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.bookAppointment(arg0);
      return from_candid_Appointment_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async canRetakeAssessment() {
    if (this.processError) {
      try {
        const result = await this.actor.canRetakeAssessment();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.canRetakeAssessment();
      return result;
    }
  }
  async cancelAppointment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelAppointment(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelAppointment(arg0);
      return result;
    }
  }
  async createArticle(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createArticle(to_candid_CreateArticleRequest_n5(this._uploadFile, this._downloadFile, arg0));
        return from_candid_ArticlePublic_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createArticle(to_candid_CreateArticleRequest_n5(this._uploadFile, this._downloadFile, arg0));
      return from_candid_ArticlePublic_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async createBlogPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createBlogPost(to_candid_CreateBlogPostRequest_n13(this._uploadFile, this._downloadFile, arg0));
        return from_candid_BlogPostPublic_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createBlogPost(to_candid_CreateBlogPostRequest_n13(this._uploadFile, this._downloadFile, arg0));
      return from_candid_BlogPostPublic_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteBlogPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteBlogPost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteBlogPost(arg0);
      return result;
    }
  }
  async getArticle(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getArticle(arg0);
        return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getArticle(arg0);
      return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getBlogPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getBlogPost(arg0);
        return from_candid_opt_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBlogPost(arg0);
      return from_candid_opt_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyAppointments() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyAppointments();
        return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyAppointments();
      return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyLatestAssessment() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyLatestAssessment();
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyLatestAssessment();
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async listAllBlogPosts() {
    if (this.processError) {
      try {
        const result = await this.actor.listAllBlogPosts();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listAllBlogPosts();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async listArticles() {
    if (this.processError) {
      try {
        const result = await this.actor.listArticles();
        return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listArticles();
      return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async listArticlesByCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listArticlesByCategory(to_candid_ArticleCategory_n7(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listArticlesByCategory(to_candid_ArticleCategory_n7(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async listAvailableSlots() {
    if (this.processError) {
      try {
        const result = await this.actor.listAvailableSlots();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listAvailableSlots();
      return result;
    }
  }
  async listPublishedBlogPosts() {
    if (this.processError) {
      try {
        const result = await this.actor.listPublishedBlogPosts();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listPublishedBlogPosts();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitAssessment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitAssessment(to_candid_SubmitAssessmentRequest_n46(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Assessment_n26(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitAssessment(to_candid_SubmitAssessmentRequest_n46(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Assessment_n26(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateBlogPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateBlogPost(to_candid_UpdateBlogPostRequest_n53(this._uploadFile, this._downloadFile, arg0));
        return from_candid_opt_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateBlogPost(to_candid_UpdateBlogPostRequest_n53(this._uploadFile, this._downloadFile, arg0));
      return from_candid_opt_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async upsertMyProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.upsertMyProfile(to_candid_UpdateProfileRequest_n55(this._uploadFile, this._downloadFile, arg0));
        return from_candid_UserProfilePublic_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.upsertMyProfile(to_candid_UpdateProfileRequest_n55(this._uploadFile, this._downloadFile, arg0));
      return from_candid_UserProfilePublic_n38(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AnswerValue_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_Answer_n29(_uploadFile, _downloadFile, value) {
  return from_candid_record_n30(_uploadFile, _downloadFile, value);
}
function from_candid_AppointmentStatus_n3(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function from_candid_Appointment_n1(_uploadFile, _downloadFile, value) {
  return from_candid_record_n2(_uploadFile, _downloadFile, value);
}
function from_candid_ArticleCategory_n11(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_ArticlePublic_n9(_uploadFile, _downloadFile, value) {
  return from_candid_record_n10(_uploadFile, _downloadFile, value);
}
function from_candid_Assessment_n26(_uploadFile, _downloadFile, value) {
  return from_candid_record_n27(_uploadFile, _downloadFile, value);
}
function from_candid_BlogPostPublic_n17(_uploadFile, _downloadFile, value) {
  return from_candid_record_n18(_uploadFile, _downloadFile, value);
}
function from_candid_BlogPostStatus_n19(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n20(_uploadFile, _downloadFile, value);
}
function from_candid_PlanningTimeline_n42(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n43(_uploadFile, _downloadFile, value);
}
function from_candid_RiskLevel_n35(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n36(_uploadFile, _downloadFile, value);
}
function from_candid_RiskProfile_n33(_uploadFile, _downloadFile, value) {
  return from_candid_record_n34(_uploadFile, _downloadFile, value);
}
function from_candid_UserProfilePublic_n38(_uploadFile, _downloadFile, value) {
  return from_candid_record_n39(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n21(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n22(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ArticlePublic_n9(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n23(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_BlogPostPublic_n17(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Assessment_n26(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_UserProfilePublic_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n41(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PlanningTimeline_n42(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    content: value.content,
    publishedAt: value.publishedAt,
    updatedAt: value.updatedAt,
    category: from_candid_ArticleCategory_n11(_uploadFile, _downloadFile, value.category),
    citations: value.citations
  };
}
function from_candid_record_n18(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_BlogPostStatus_n19(_uploadFile, _downloadFile, value.status),
    title: value.title,
    content: value.content,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    featuredImageUrl: record_opt_to_undefined(from_candid_opt_n21(_uploadFile, _downloadFile, value.featuredImageUrl)),
    excerpt: value.excerpt
  };
}
function from_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_AppointmentStatus_n3(_uploadFile, _downloadFile, value.status),
    reasonForVisit: value.reasonForVisit,
    userId: value.userId,
    name: value.name,
    createdAt: value.createdAt,
    email: value.email,
    slotId: value.slotId,
    slotStartTime: value.slotStartTime,
    phone: value.phone
  };
}
function from_candid_record_n27(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    userId: value.userId,
    answers: from_candid_vec_n28(_uploadFile, _downloadFile, value.answers),
    createdAt: value.createdAt,
    riskProfile: from_candid_RiskProfile_n33(_uploadFile, _downloadFile, value.riskProfile)
  };
}
function from_candid_record_n30(_uploadFile, _downloadFile, value) {
  return {
    value: from_candid_AnswerValue_n31(_uploadFile, _downloadFile, value.value),
    questionId: value.questionId
  };
}
function from_candid_record_n34(_uploadFile, _downloadFile, value) {
  return {
    completedAt: value.completedAt,
    recommendations: value.recommendations,
    overallRisk: from_candid_RiskLevel_n35(_uploadFile, _downloadFile, value.overallRisk)
  };
}
function from_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    age: record_opt_to_undefined(from_candid_opt_n40(_uploadFile, _downloadFile, value.age)),
    healthHistoryConsent: value.healthHistoryConsent,
    planningTimeline: record_opt_to_undefined(from_candid_opt_n41(_uploadFile, _downloadFile, value.planningTimeline)),
    displayName: value.displayName,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt
  };
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "reproductiveTesting" in value ? "reproductiveTesting" : "stress" in value ? "stress" : "sexualHealth" in value ? "sexualHealth" : "general" in value ? "general" : "lifestyle" in value ? "lifestyle" : "nutrition" in value ? "nutrition" : value;
}
function from_candid_variant_n20(_uploadFile, _downloadFile, value) {
  return "published" in value ? "published" : "draft" in value ? "draft" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "nat" in value ? {
    __kind__: "nat",
    nat: value.nat
  } : "bool" in value ? {
    __kind__: "bool",
    bool: value.bool
  } : "text" in value ? {
    __kind__: "text",
    text: value.text
  } : value;
}
function from_candid_variant_n36(_uploadFile, _downloadFile, value) {
  return "areasToImprove" in value ? "areasToImprove" : "optimized" in value ? "optimized" : "consultSpecialist" in value ? "consultSpecialist" : value;
}
function from_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "confirmed" in value ? "confirmed" : value;
}
function from_candid_variant_n43(_uploadFile, _downloadFile, value) {
  return "within1Year" in value ? "within1Year" : "moreThan1Year" in value ? "moreThan1Year" : "notSure" in value ? "notSure" : "within3Months" in value ? "within3Months" : "within6Months" in value ? "within6Months" : value;
}
function from_candid_vec_n24(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Appointment_n1(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n28(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Answer_n29(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n44(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_BlogPostPublic_n17(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n45(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ArticlePublic_n9(_uploadFile, _downloadFile, x));
}
function to_candid_AnswerValue_n51(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n52(_uploadFile, _downloadFile, value);
}
function to_candid_Answer_n49(_uploadFile, _downloadFile, value) {
  return to_candid_record_n50(_uploadFile, _downloadFile, value);
}
function to_candid_ArticleCategory_n7(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function to_candid_BlogPostStatus_n15(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function to_candid_CreateArticleRequest_n5(_uploadFile, _downloadFile, value) {
  return to_candid_record_n6(_uploadFile, _downloadFile, value);
}
function to_candid_CreateBlogPostRequest_n13(_uploadFile, _downloadFile, value) {
  return to_candid_record_n14(_uploadFile, _downloadFile, value);
}
function to_candid_PlanningTimeline_n57(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n58(_uploadFile, _downloadFile, value);
}
function to_candid_SubmitAssessmentRequest_n46(_uploadFile, _downloadFile, value) {
  return to_candid_record_n47(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateBlogPostRequest_n53(_uploadFile, _downloadFile, value) {
  return to_candid_record_n54(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateProfileRequest_n55(_uploadFile, _downloadFile, value) {
  return to_candid_record_n56(_uploadFile, _downloadFile, value);
}
function to_candid_record_n14(_uploadFile, _downloadFile, value) {
  return {
    status: to_candid_BlogPostStatus_n15(_uploadFile, _downloadFile, value.status),
    title: value.title,
    content: value.content,
    featuredImageUrl: value.featuredImageUrl ? candid_some(value.featuredImageUrl) : candid_none(),
    excerpt: value.excerpt
  };
}
function to_candid_record_n47(_uploadFile, _downloadFile, value) {
  return {
    answers: to_candid_vec_n48(_uploadFile, _downloadFile, value.answers)
  };
}
function to_candid_record_n50(_uploadFile, _downloadFile, value) {
  return {
    value: to_candid_AnswerValue_n51(_uploadFile, _downloadFile, value.value),
    questionId: value.questionId
  };
}
function to_candid_record_n54(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: to_candid_BlogPostStatus_n15(_uploadFile, _downloadFile, value.status),
    title: value.title,
    content: value.content,
    featuredImageUrl: value.featuredImageUrl ? candid_some(value.featuredImageUrl) : candid_none(),
    excerpt: value.excerpt
  };
}
function to_candid_record_n56(_uploadFile, _downloadFile, value) {
  return {
    age: value.age ? candid_some(value.age) : candid_none(),
    healthHistoryConsent: value.healthHistoryConsent,
    planningTimeline: value.planningTimeline ? candid_some(to_candid_PlanningTimeline_n57(_uploadFile, _downloadFile, value.planningTimeline)) : candid_none(),
    displayName: value.displayName
  };
}
function to_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    title: value.title,
    content: value.content,
    category: to_candid_ArticleCategory_n7(_uploadFile, _downloadFile, value.category),
    citations: value.citations
  };
}
function to_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return value == "published" ? {
    published: null
  } : value == "draft" ? {
    draft: null
  } : value;
}
function to_candid_variant_n52(_uploadFile, _downloadFile, value) {
  return value.__kind__ === "nat" ? {
    nat: value.nat
  } : value.__kind__ === "bool" ? {
    bool: value.bool
  } : value.__kind__ === "text" ? {
    text: value.text
  } : value;
}
function to_candid_variant_n58(_uploadFile, _downloadFile, value) {
  return value == "within1Year" ? {
    within1Year: null
  } : value == "moreThan1Year" ? {
    moreThan1Year: null
  } : value == "notSure" ? {
    notSure: null
  } : value == "within3Months" ? {
    within3Months: null
  } : value == "within6Months" ? {
    within6Months: null
  } : value;
}
function to_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return value == "reproductiveTesting" ? {
    reproductiveTesting: null
  } : value == "stress" ? {
    stress: null
  } : value == "sexualHealth" ? {
    sexualHealth: null
  } : value == "general" ? {
    general: null
  } : value == "lifestyle" ? {
    lifestyle: null
  } : value == "nutrition" ? {
    nutrition: null
  } : value;
}
function to_candid_vec_n48(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_Answer_n49(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useListArticles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listArticles();
    },
    enabled: !!actor && !isFetching
  });
}
function useGetArticle(articleId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["article", articleId == null ? void 0 : articleId.toString()],
    queryFn: async () => {
      if (!actor || articleId === null) return null;
      return actor.getArticle(articleId);
    },
    enabled: !!actor && !isFetching && articleId !== null
  });
}
function useGetMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching
  });
}
function useGetMyLatestAssessment() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["assessment"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyLatestAssessment();
    },
    enabled: !!actor && !isFetching
  });
}
function useCanRetakeAssessment() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["assessment", "canRetake"],
    queryFn: async () => {
      if (!actor) return true;
      return actor.canRetakeAssessment();
    },
    enabled: !!actor && !isFetching
  });
}
function useSubmitAssessment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitAssessment(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment"] });
    }
  });
}
function useListAvailableSlots() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableSlots();
    },
    enabled: !!actor && !isFetching
  });
}
function useGetMyAppointments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAppointments();
    },
    enabled: !!actor && !isFetching
  });
}
function useBookAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.bookAppointment(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    }
  });
}
function useCancelAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
}
function useListPublishedBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["blog", "published"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching
  });
}
function useGetBlogPost(postId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["blog", "post", postId == null ? void 0 : postId.toString()],
    queryFn: async () => {
      if (!actor || postId === null) return null;
      return actor.getBlogPost(postId);
    },
    enabled: !!actor && !isFetching && postId !== null
  });
}
function useListAllBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["blog", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllBlogPosts();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBlogPost(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    }
  });
}
function useUpdateBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateBlogPost(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    }
  });
}
function useDeleteBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBlogPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    }
  });
}
export {
  ArticleCategory as A,
  BlogPostStatus as B,
  RiskLevel as R,
  useGetArticle as a,
  useGetMyLatestAssessment as b,
  useCanRetakeAssessment as c,
  useSubmitAssessment as d,
  useGetMyProfile as e,
  useGetMyAppointments as f,
  useCancelAppointment as g,
  AppointmentStatus as h,
  useListAvailableSlots as i,
  useBookAppointment as j,
  useListPublishedBlogPosts as k,
  useGetBlogPost as l,
  useListAllBlogPosts as m,
  useCreateBlogPost as n,
  useUpdateBlogPost as o,
  useDeleteBlogPost as p,
  useListArticles as u
};
