///<reference path="../testReference.ts" />

describe("Dispatchers", () => {
  describe("Dispatcher", () => {
    it("can connect and disconnect dispatcher to the DOM", () => {
      let dispatcher = new Plottable.Dispatcher();

      let callbackCalls = 0;
      (<any> dispatcher)._eventToCallback["click"] = () => callbackCalls++;

      let d3document = d3.select(document);
      (<any> dispatcher)._connect();
      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.strictEqual(callbackCalls, 1, "connected correctly (callback was called)");

      (<any> dispatcher)._connect();
      callbackCalls = 0;
      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.strictEqual(callbackCalls, 1, "can't double-connect (callback only called once)");

      (<any> dispatcher)._disconnect();
      callbackCalls = 0;
      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.strictEqual(callbackCalls, 0, "disconnected correctly (callback not called)");
    });

    it("doesn't disconnect if still having listeners (in the callback set)", () => {
      let dispatcher = new Plottable.Dispatcher();

      let callbackWasCalled = false;
      (<any> dispatcher)._eventToCallback["click"] = () => callbackWasCalled = true;

      let callback = () => { return; };
      let callbackSet = new Plottable.Utils.CallbackSet<Function>();
      callbackSet.add(callback);
      (<any> dispatcher)._callbacks = [callbackSet];

      let d3document = d3.select(document);
      (<any> dispatcher)._connect();

      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.isTrue(callbackWasCalled, "connected correctly (callback was called)");

      (<any> dispatcher)._disconnect();
      callbackWasCalled = false;
      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.isTrue(callbackWasCalled, "didn't disconnect while dispatcher had listener");

      callbackSet.delete(callback);
      (<any> dispatcher)._disconnect();
      callbackWasCalled = false;
      TestMethods.triggerFakeUIEvent("click", d3document);
      assert.isFalse(callbackWasCalled, "disconnected when dispatcher had no listeners");
    });

    it("can set and unset callbacks", () => {
      let dispatcher = new Mocks.BasicDispatcher();
      let callbackSet = new Plottable.Utils.CallbackSet<Function>();

      let callbackWasCalled = false;
      let callback = () => callbackWasCalled = true;

      dispatcher.setCallback(callbackSet, callback);
      callbackSet.callCallbacks();
      assert.isTrue(callbackWasCalled, "callback was called after setting with _setCallback()");

      dispatcher.unsetCallback(callbackSet, callback);
      callbackWasCalled = false;
      callbackSet.callCallbacks();
      assert.isFalse(callbackWasCalled, "callback was removed by calling _unsetCallback()");
    });
  });
});

module Mocks {
  export class BasicDispatcher extends Plottable.Dispatcher {

    public dummyCallbackSet: Plottable.Utils.CallbackSet<Function>;

    public constructor() {
      super();
      this.dummyCallbackSet = new Plottable.Utils.CallbackSet<Function>();
    }

    public listenToEvent(event: string, callback: (e: Event) => any) {
      this._eventToCallback[event] = callback;
    }

    public disconnect() {

    }

    public setCallback(callbackSet: Plottable.Utils.CallbackSet<Function>, callback: Function) {
      return this._setCallback(callbackSet, callback);
    }

    public unsetCallback(callbackSet: Plottable.Utils.CallbackSet<Function>, callback: Function) {
      return this._unsetCallback(callbackSet, callback);

    }
  }
}
