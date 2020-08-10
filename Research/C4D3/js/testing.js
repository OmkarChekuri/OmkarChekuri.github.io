

// C4D3 is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option) any
// later version.
//
// This file is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.



class VariableEvent {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(variable, t_type, type, value, time) {
        //super(type);
        //super(variable)  //need to implement
        this.variable = variable;
        if (variable && type && value && time) {
            if ((VariableEvent.MIN_TYPE > t_type) || (t_type > VariableEvent.MAX_TYPE))
                throw new Error("Unknown type");
            this.t_type = t_type;
            if (value == undefined) {
                this.value = null;
            }
            else {
                this.value = value;
            }
            if (time = undefined) {
                this.time = Date.now();
            }
            else {
                this.time = time;
            }
        }
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getVariable() {
        return this.variable; //omkar: needs to check 
    }
    getType() {
        return this.t_type;
    }
    getValue() {
        return this.value;
    }
    getTime() {
        return this.time;
    }
}
//**********************************************************************
// Public Class Members
//**********************************************************************
VariableEvent.DISPOSING = 0;
VariableEvent.NAME_CHANGED = 1;
VariableEvent.VALUE_CHANGED = 2;
VariableEvent.FOCUS_CHANGED = 3;
VariableEvent.EDIT_CHANGED = 4;
VariableEvent.LOCK_CHANGED = 5;
VariableEvent.TRACK_CHANGED = 6;
VariableEvent.SHARE_CHANGED = 7;
VariableEvent.MIN_TYPE = 0;
VariableEvent.MAX_TYPE = 7;
//******************************************************************************
//# sourceMappingURL=VariableEvent.js.map

//******************************************************************************
// class SharedFlag
//******************************************************************************
class SharedFlag {
    constructor() {
        //**********************************************************************
        // Private Members
        //**********************************************************************
        // State (internal) variables
        this.set = [];
    }
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    SharedFlag() {
        this.set = new Array(4);
    }
    //**********************************************************************
    // Public Methods
    //**********************************************************************
    /**
     * Returns the overall state of the shared flag; that is, returns
     * <CODE>true</CODE> if one or more associated object have indicated that
     * it is <CODE>true</CODE>.
     */
    getState(obj) {
        if (obj) {
            return !(this.set.indexOf(obj.toString()));
        }
        else {
            return !(this.set.length < 1);
        }
    }
    /**
     * Associates an object with a particular state of the shared flag. On
     * return, indicates whether the overall state of the flag changed as a
     * result of the association.
     *
     * @param		b		the state of the flag according to the object
     * @param		object	an object
     * @return		whether or not the flag's shared state changed
     */
    setState(b, obj) {
        var changed = false;
        if (b) {
            if (Array.isArray(this.set) && this.set.length) {
                this.set.push(obj);
                changed = true;
            }
            else if (!this.set.indexOf(obj)) {
                this.set.push(obj);
            }
        }
        else {
            if (this.set.splice(this.set.indexOf(obj), 1) && (Array.isArray(this.set) && this.set.length))
                changed = true;
        }
        return changed;
    }
}
//******************************************************************************
//# sourceMappingURL=SharedFlag.js.map

class printClass {
}
printClass.printStatus = false;
//# sourceMappingURL=printClass.js.map

class LivePropertyEvent //extends EventObject
 {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    //property:LiveProperty;
    /**
     * Creates an event triggered by a change to the Variable bound to a
     * LiveProperty.
     */
    constructor(property, e) {
        if (printClass.printStatus)
            console.log("Constructor of liveProperty Event");
        //if(printClass.printStatus) console.log(property.getVariable().prototype.value);
        //if(printClass.printStatus) console.log(e);
        //if(printClass.printStatus) console.log(property);
        //if(printClass.printStatus) console.log(property.getControl());
        //super(property)
        this.property = property;
        if (property && e) {
            this.e = e;
        }
        else {
            this.e = null;
        }
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    /**
     * Returns the LiveProperty that generated this event.
     */
    getLiveProperty() {
        return this.property;
    }
    /**
     * Returns the VariableEvent that triggered this event, or <CODE>null</CODE>
     * if this event was triggered by the binding of a new <CODE>Variable</CODE>
     * to a LiveProperty.
     */
    getVariableEvent() {
        return this.e;
    }
}
//******************************************************************************
//# sourceMappingURL=LivePropertyEvent.js.map

class LiveProperty {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(control, tag, prototype, interactive) {
        this.variable = null; // Active value																	// omkar note: changed this to public to access in controlslider method to overcome some error.
        this.inFocus = true;
        this.inEdit = true;
        //if(printClass.printStatus) console.log("I am in constructor method of LiveProperty with tag: " + tag );
        this.control = control;
        this.tag = tag;
        this.prototype = prototype;
        if (interactive != undefined) {
            this.interactive = interactive;
        }
        else {
            this.interactive = false;
        }
        //if(printClass.printStatus) console.log("I am in end of constructor method of LiveProperty");
        this.listeners = [];
        //if(printClass.printStatus) console.log(this.status);
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getControl() {
        return this.control;
    }
    getTag() {
        return this.tag;
    }
    getPrototype() {
        return this.prototype;
    }
    getInteractive() {
        return this.interactive;
    }
    getVariable() {
        return this.variable;
    }
    setVariable(variable) {
        if (printClass.printStatus)
            console.log("setVariable Method of LiveProperty");
        //printClass.myprint(variable); 
        if (printClass.printStatus)
            console.log(variable);
        if (this.variable == variable)
            return;
        // var x  =variable!.getPrototype();
        // var y = this.prototype;
        // if(printClass.printStatus) console.log(x.value.__proto__);
        // if(printClass.printStatus) console.log( y.value.__proto__);
        //if ((variable != null) &&  !(variable.getPrototype()).isInstance(LiveProperty.prototype))
        if ((variable != null) && !(Object.getPrototypeOf(variable.getPrototype().value) == Object.getPrototypeOf(this.prototype.value))) {
            throw new Error("\nType mismatch:" + "\n" + this.prototype + "\n" + variable.getPrototype());
        }
        //if(printClass.printStatus) console.log("Hello");
        if (this.variable != null) {
            if (this.inFocus)
                this.variable.setFocusing(false, this);
            if (this.inEdit)
                this.variable.setEditing(false, this);
            this.variable.removeVariableListener(this);
        }
        //if(printClass.printStatus) console.log("Hi");
        // This is where the magic happens  ***********************For Binding************************
        //if(printClass.printStatus) console.log(this.control.);
        //if(printClass.printStatus) console.log("Before setting variable");
        //if(printClass.printStatus) console.log(this.variable);
        this.variable = variable;
        //this.prototype1 = variable.getPrototype();
        //if(printClass.printStatus) console.log("After Setting Variable");
        //if(printClass.printStatus) console.log(this.variable);
        //if(printClass.printStatus) console.log(this);
        //this.control.propertyChanged(new LivePropertyEvent(this,null));
        if (printClass.printStatus)
            console.log(variable);
        //*********************************************************************************************
        if (this.variable != null) {
            variable.addVariableListener(this);
            if (this.inFocus)
                this.variable.setFocusing(true, this);
            if (this.inEdit)
                this.variable.setEditing(true, this);
        }
        //this.fireEvent(new LivePropertyEvent(this, null));
        this.firePropertyChanged(new LivePropertyEvent(this, null));
    }
    //**********************************************************************
    // Public Methods
    //**********************************************************************
    getType() {
        return this.prototype.getType;
    }
    getName() {
        if (this.variable == null)
            return this.prototype.getName;
        else
            return this.variable.getName();
    }
    setName(name) {
        if (name == null)
            name = this.prototype.getName;
        if (this.variable != null)
            this.variable.setName(name);
    }
    getValue() {
        if (this.variable == null)
            return this.prototype.getValue();
        else
            return this.variable.getValue();
    }
    setValue(value) {
        if (printClass.printStatus)
            console.log(value);
        if (printClass.printStatus)
            console.log('SetValue in LiveProperty');
        if (value == null) {
            if (printClass.printStatus)
                console.log("Object is null");
            value = this.prototype.getValue();
        }
        //if(printClass.printStatus) console.log(object);	
        if (this.variable != null)
            this.variable.setValue(value);
    }
    touch() {
        if (this.variable != null)
            this.variable.touch();
    }
    //**********************************************************************
    // Public Methods (Locking)
    //**********************************************************************
    isLocked() {
        return ((this.variable == null) || this.variable.isLocked());
    }
    //**********************************************************************
    // Public Methods (Focusing)
    //**********************************************************************
    isFocusing() {
        //return (inFocus || ((variable != null) && variable.isFocusing()));
        if (this.variable == null)
            return this.inFocus;
        else
            return this.variable.isFocusing();
    }
    setFocusing(b) {
        if (this.inFocus == b)
            return;
        this.inFocus = b;
        if (this.variable != null)
            this.variable.setFocusing(this.inFocus, this);
    }
    //**********************************************************************
    // Public Methods (Editing)
    //**********************************************************************
    isEditing() {
        //return (inEdit || ((variable != null) && variable.isEditing()));
        if (this.variable == null)
            return this.inEdit;
        else
            return this.variable.isEditing();
    }
    setEditing(b) {
        if (this.inEdit == b)
            return;
        this.inEdit = b;
        if (this.variable != null)
            this.variable.setEditing(this.inEdit, this);
    }
    //**********************************************************************
    // Public Methods (Events)
    //**********************************************************************
    addLivePropertyListener(l) {
        if (printClass.printStatus)
            console.log(l.toString());
        if (printClass.printStatus)
            console.log(l);
        this.listeners.push(l);
    }
    removeLivePropertyListener(l) {
        this.listeners.splice(this.listeners.indexOf(l), 1);
    }
    //**********************************************************************
    // Override Methods (Disposable)
    //**********************************************************************
    dispose() {
        if (this.variable != null) {
            if (this.inFocus)
                this.variable.setFocusing(false, this);
            if (this.inEdit)
                this.variable.setEditing(false, this);
            this.variable.removeVariableListener(this);
            this.variable.dispose;
        }
    }
    //**********************************************************************
    // Override Methods (VariableListener)
    //**********************************************************************
    variableChanged(e) {
        //if(printClass.printStatus) console.log(" finally 30000000000000000000000000000000000000")
        //if(printClass.printStatus) console.log(e.getType());
        //if(printClass.printStatus) console.log(VariableEvent.DISPOSING);
        //if (e.getType == VariableEvent.DISPOSING)
        //	this.setVariable(null);
        //else
        this.fireEvent(new LivePropertyEvent(this, e));
    }
    //**********************************************************************
    // Private Methods (Events)
    //**********************************************************************
    fireEvent(e) {
        if (Variable.STARTUP) {
            var ve = e.getVariableEvent();
            if (ve != null)
                return;
            //LiveProperty	property = e.getLiveProperty();
            //System.out.println(property.control + "." + property.tag);
        }
        /* if (Variable.ASYNC_EVENTS)
            SystemEventUtilities.invokeLater(new AsyncFireEvent(e));
        else */
        this.firePropertyChanged(e);
    }
    firePropertyChanged(e) {
        if (printClass.printStatus)
            console.log("firePropertyChanged of LiveProperty");
        var n = this.listeners.length;
        var i;
        for (i = 0; i < n; i++) {
            if (printClass.printStatus)
                console.log(this.listeners[i]);
        }
        if (printClass.printStatus)
            console.log("Number of Listeners:" + n);
        if (printClass.printStatus)
            console.log(e);
        //if(printClass.printStatus) console.log(this.status);
        for (i = 0; i < n; i++) {
            if (printClass.printStatus)
                console.log("Listener :" + i + 1);
            //if(printClass.printStatus) console.log(this.variable?.getPrototype().value);    //90
            //if(printClass.printStatus) console.log("hi")
            if (printClass.printStatus)
                console.log(this.listeners[i]); //not working
            //if(printClass.printStatus) console.log(this.listeners[i].propertyChanged(e));
            this.listeners[i].propertyChanged(e);
            // if(printClass.printStatus) console.log(this.control.propertyChanged);
            // if(printClass.printStatus) console.log(this.;
            //if(printClass.printStatus) console.log(this.getPrototype());
            // this.(this.variable?.getPrototype().value)
            //this.control.
        }
    }
}
/* export class AsyncFireEvent
{
    private  e: LivePropertyEvent;

    constructor(e: LivePropertyEvent)
    {
        
        this.e = e;
    }

    run(): void
    {
        this.firePropertyChanged(this.e);
    }
} */
//******************************************************************************
//# sourceMappingURL=LiveProperty.js.map

class Variable {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(prototype, name, _value) {
        this.prototype = prototype;
        this.fflag = new SharedFlag();
        this.eflag = new SharedFlag();
        this.lflag = new SharedFlag();
        this.tflag = new SharedFlag();
        this.sflag = new SharedFlag();
        this.listeners = new Array;
        this.name = name;
        this.value = _value;
        if (printClass.printStatus)
            console.log("Second : Variable created");
        if (printClass.printStatus)
            console.log(this.prototype.value);
        if (printClass.printStatus)
            console.log(this.value);
    }
    //**********************************************************************
    //  Class Methods
    //**********************************************************************
    static initStartup() {
        Variable.ASYNC_EVENTS = false;
        Variable.STARTUP = true;
    }
    static termStartup() {
        Variable.ASYNC_EVENTS = true;
        Variable.STARTUP = false;
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getPrototype() {
        return this.prototype;
    }
    getName() {
        return ((name == null) ? this.prototype.getName : name);
    }
    setName(name) {
        if ((name != null) && (name == (this.name)))
            return;
        this.name = name;
        this.fireEvent(new VariableEvent(this, VariableEvent.NAME_CHANGED, name));
    }
    getValue() {
        return ((this.value == null) ? Variable.prototype.getValue() : this.value);
    }
    setValue(value) {
        if (printClass.printStatus)
            console.log("SetValue in Variable");
        if (this.prototype.getConstant() || this.isLocked())
            return;
        if (printClass.printStatus)
            console.log(this.prototype.classType);
        if (printClass.printStatus)
            console.log(value.__proto__);
        if (printClass.printStatus)
            console.log(value);
        if ((value != null) && !(this.prototype.classType == value.__proto__))
            throw new Error(value.__proto__.name);
        if ((value == null) && (this.value == null))
            return;
        if ((value != null) && (value == (this.value)))
            return;
        if (this.value == value)
            return;
        //if(printClass.printStatus) console.log(this);
        if (printClass.printStatus)
            console.log("Value before updating Variable: " + this.value);
        if (printClass.printStatus)
            console.log("Value of prototype before updating Variable: " + this.prototype.value);
        this.value = value;
        this.prototype.value = value; //This Step Solved a Major Problem
        if (printClass.printStatus)
            console.log("Value after updating Variable: " + this.value);
        if (printClass.printStatus)
            console.log("Value of prototype after updating Variable: " + this.prototype.value);
        //if(printClass.printStatus) console.log(VariableEvent.VALUE_CHANGED)
        var varEvent = new VariableEvent(this, VariableEvent.VALUE_CHANGED, "dummy", value);
        if (printClass.printStatus)
            console.log(varEvent);
        if (printClass.printStatus)
            console.log(this);
        this.fireEvent(varEvent);
    }
    //**********************************************************************
    //  public Methods
    //**********************************************************************
    getType() {
        return Variable.prototype.getType();
    }
    isAssignableFrom(variable) {
        return this.prototype.isAssignableFrom(variable.getPrototype());
    }
    touch() {
        this.fireEvent(new VariableEvent(this, VariableEvent.VALUE_CHANGED));
    }
    getBoundProperties() {
        var properties = new Array();
        var n = this.listeners.length;
        var i = 0;
        for (i = 0; i < n; i++)
            if ((this.listeners[i] instanceof LiveProperty) &&
                (this.listeners[i]).getVariable() == this)
                properties.push(this.listeners[i]);
        return properties;
    }
    //**********************************************************************
    //  Methods (Focusing)
    //**********************************************************************
    isFocusing() {
        //return fflag.getState();
        return (this.isLocked() ? false : this.fflag.getState());
    }
    setFocusing(b, object) {
        if (this.fflag.setState(b, object))
            this.fireEvent(new VariableEvent(this, VariableEvent.FOCUS_CHANGED));
    }
    isSelfFocusing() {
        return this.fflag.getState(Variable);
    }
    setSelfFocusing(b) {
        this.setFocusing(b, Variable);
    }
    //**********************************************************************
    //  Methods (Editing)
    //**********************************************************************
    isEditing() {
        //return eflag.getState();
        return (this.isLocked() ? false : this.eflag.getState());
    }
    setEditing(b, object) {
        if (this.eflag.setState(b, object))
            this.fireEvent(new VariableEvent(this, VariableEvent.EDIT_CHANGED));
    }
    isSelfEditing() {
        return this.eflag.getState(Variable);
    }
    setSelfEditing(b) {
        this.setEditing(b, Variable);
    }
    //**********************************************************************
    //  Methods (Locking)
    //**********************************************************************
    isLocked() {
        return this.lflag.getState();
    }
    setLocked(b, object) {
        if (this.lflag.setState(b, object))
            this.fireEvent(new VariableEvent(this, VariableEvent.LOCK_CHANGED));
    }
    isSelfLocked() {
        return this.lflag.getState(Variable);
    }
    setSelfLocked(b) {
        this.setLocked(b, Variable);
    }
    //**********************************************************************
    //  Methods (Tracking)
    //**********************************************************************
    isTracked() {
        return this.tflag.getState();
    }
    setTracked(b, object) {
        if (this.tflag.setState(b, object))
            this.fireEvent(new VariableEvent(this, VariableEvent.TRACK_CHANGED));
    }
    isSelfTracked() {
        return this.tflag.getState(Variable);
    }
    setSelfTracked(b) {
        this.setTracked(b, Variable);
    }
    //**********************************************************************
    //  Methods (Shared)
    //**********************************************************************
    isShared() {
        return this.sflag.getState();
    }
    setShared(b, object) {
        if (this.sflag.setState(b, object))
            this.fireEvent(new VariableEvent(this, VariableEvent.SHARE_CHANGED));
    }
    isSelfShared() {
        return this.sflag.getState(Variable);
    }
    setSelfShared(b) {
        this.setShared(b, Variable);
    }
    //**********************************************************************
    //  Methods (Events)
    //**********************************************************************
    addVariableListener(l) {
        this.listeners.push(l);
        if (printClass.printStatus)
            console.log("addVariableListener of Variable");
        if (printClass.printStatus)
            console.log(l);
    }
    removeVariableListener(l) {
        this.listeners.splice(this.listeners.indexOf(l), 1);
    }
    //**********************************************************************
    // Override Methods (Disposable)
    //**********************************************************************
    dispose() {
        //if (this.value instanceof Value)
        //	(this.value).disassociate(this);
        this.fireEvent(new VariableEvent(this, VariableEvent.DISPOSING));
    }
    //**********************************************************************
    // Override Methods (Object)
    //**********************************************************************
    // toString(): String
    // {
    // 	return (Variable.prototype.getName +
    // 		"[" + Variable.prototype + ", \"" + this.name + "\", " + this.value + "]");
    // }
    //**********************************************************************
    // Private Methods (Events)
    //**********************************************************************
    fireEvent(e) {
        if (printClass.printStatus)
            console.log(e);
        // if (Variable.ASYNC_EVENTS)
        // 	setTimeout(this.fireVariableChanged, 0,e); 
        // else
        this.fireVariableChanged(e);
    }
    fireVariableChanged(e) {
        //if(printClass.printStatus) console.log(this.listeners)
        var n = e.getVariable().listeners.length;
        if (printClass.printStatus)
            console.log(n);
        var i = 0;
        for (i = 0; i < n; i++) {
            //if(printClass.printStatus) console.log(this.listeners[i]);
            //if(printClass.printStatus) console.log(this.listeners[i].getControl());
            //if(printClass.printStatus) console.log(this.listeners[i].getControl().ControlName);
        }
        for (i = 0; i < n; i++) {
            try {
                //if(printClass.printStatus) console.log(this.listeners[i]);
                (this.listeners[i]).variableChanged(e);
            }
            catch (error) {
                //if(printClass.printStatus) console.log((VariableListener)listeners.at(i));
            }
        }
    }
}
//**********************************************************************
//  Class Members
//**********************************************************************
/**
 * If true, notify event handlers using Runnable invoked later.
 */
Variable.ASYNC_EVENTS = true;
Variable.STARTUP = false;
//# sourceMappingURL=Variable.js.map

//import { typeOfValue } from "../index";
class Prototype {
    constructor(classType, name, value, constant) {
        this.myMap = new Map();
        // Optimization (transient) variables
        this.hc = 0;
        this.myMap.set(Number.prototype, 0);
        this.myMap.set(String.prototype, "");
        this.myMap.set(Boolean.prototype, false);
        // for (let [key, value] of this.myMap) {
        // 	if(printClass.printStatus) console.log(key + ' = ' + value)
        //   }
        //if(printClass.printStatus) console.log();
        if (classType == undefined) {
            throw Error("Prototype Constructor cannot be initialised with undefined classtype");
        }
        else {
            this.classType = ((classType == null) ? Object.getPrototypeOf(value) : classType);
        }
        this.name = ((name == null) ? "" : name);
        //need to fix this
        if ((value != null) && !(this.classType == Object.getPrototypeOf(value))) {
            throw new Error(" 'Class Type':" + classType + " does not match with 'value type':" + typeof value + " or value is null");
        }
        else {
            //this.value =  value;
            this.value = this.getDefault(classType);
        }
        //check if constant is provided
        if (constant) {
            this.constant = constant;
        }
        else {
            this.constant = false;
        }
        if (printClass.printStatus)
            console.log("First : prototype created");
        //console.table(this);
        if (printClass.printStatus)
            console.log(this);
    }
    getDefault(type) {
        return this.myMap.get(type);
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    get getType() {
        return this.classType;
    }
    get getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
    getConstant() {
        return this.constant;
    }
    //**********************************************************************
    // Public Methods
    //**********************************************************************
    /**
     * Determines if the reference type of this Prototype is a superclass or
     * superinterface of the reference type of the specified Prototype. Also
     * returns false if this Prototype is constant and the specified Prototype
     * is not.
     *
     * @see		java.lang.Class#isAssignableFrom
     */
    isAssignableFrom(prototype) {
        if (printClass.printStatus)
            console.log("I am in isassignable from of prototype");
        if (this == prototype)
            return true;
        if (this.constant && !prototype.constant)
            return false;
        else
            return (this.classType == (prototype.classType));
    }
    /**
     * Returns true if the specified value is non-null and can be cast to the
     * reference type of this Prototype without raising a ClassCastException.
     * It returns false otherwise.
     *
     * @see		java.lang.Class#isInstance
     */
    isInstance(value) {
        return this.classType == typeof value;
    }
    //**********************************************************************
    // Override Methods (Object)
    //**********************************************************************
    equals(object) {
        if (this == object)
            return true;
        if (!(object instanceof Prototype))
            return false;
        var that = object;
        if ((this.classType != that.classType) ||
            (this.name != that.name) ||
            (this.constant != that.constant))
            return false;
        if (this.value == null)
            return (that.value == null);
        else
            return (this.value == (that.value));
    }
}
//******************************************************************************
//# sourceMappingURL=Prototype.js.map

class ControlInfo {
    //**********************************************************************
    // Public Class Methods
    //**********************************************************************
    static bind(control, tag, variable) {
        control.describe().getLiveProperty(tag).setVariable(variable);
    }
    static unbind(control, tag) {
        control.describe().getLiveProperty(tag).setVariable(null);
    }
    static transduce(src, dst, srcTag, dstTag) {
        if (src && dst && srcTag && dstTag) {
            var srcProperty = src.describe().getLiveProperty(srcTag);
            var variable = srcProperty.getVariable();
            if (variable == null)
                ControlInfo.unbind(dst, dstTag);
            else
                ControlInfo.bind(dst, dstTag, variable);
        }
        else if ((src && dst && srcTag)) {
            ControlInfo.transduce(src, dst, srcTag, srcTag);
        }
        else if ((src && dst && dstTag)) {
            ControlInfo.transduce(src, dst, dstTag, dstTag);
        }
        else if (src && dst) {
            var tags = src.describe().getTags();
            var i;
            for (i = 0; i < tags.length; i++) {
                ControlInfo.transduce(src, dst, tags[i]);
            }
        }
    }
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(proxy) {
        this.proxy = proxy;
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getControl() {
        return this.proxy.getControl();
    }
    //**********************************************************************
    // Public Methods (Properties)
    //**********************************************************************
    /**
     * Returns a vector of all LiveProperty tags, in the order added.
     */
    getTags() {
        return this.proxy.getTags();
    }
    /**
     * Returns the number of LiveProperty tags.
     */
    getTagCount() {
        return this.proxy.getTagCount();
    }
    /**
     * Returns the LiveProperty tag at the specified index.
     */
    getTagAt(index) {
        return this.proxy.getTagAt(index);
    }
    /**
     * Returns where a tag is in the vector of all tags, or -1 if absent.
     */
    getIndexOfTag(tag) {
        return this.proxy.getIndexOfTag(tag);
    }
    /**
     * Returns the LiveProperty associated with the specified tag, or null if
     * none exists.
     *
     * @param		tag		the name of the LiveProperty to retrieve
     */
    getLiveProperty(tag) {
        return this.proxy.getLiveProperty(tag);
    }
    /**
     * Returns a vector of all LiveProperties, in the order added.
     */
    getLiveProperties() {
        return this.proxy.getLiveProperties();
    }
    /**
     * Returns the property at the specified index.
     */
    getPropertyAt(index) {
        return this.proxy.getPropertyAt(index);
    }
    /**
     * Convenience method to register a listener with all current properties.
     * This method does NOT automatically handle addition and removal of
     * properties to the control. (Use ControlListener to detect such changes.)
     */
    addLivePropertyListener(l) {
        this.proxy.addLivePropertyListener(l);
    }
    /**
     * Convenience method to deregister a listener with all current properties.
     * This method does NOT automatically handle addition and removal of
     * properties to the control. (Use ControlListener to detect such changes.)
     */
    removeLivePropertyListener(l) {
        this.proxy.removeLivePropertyListener(l);
    }
    //**********************************************************************
    // Public Methods (Properties, Variable Access)
    //**********************************************************************
    getVariable(tag) {
        return this.proxy.getVariable(tag);
    }
    setVariable(tag, variable) {
        this.proxy.setVariable(tag, variable);
    }
    getName(tag) {
        return this.proxy.getName(tag);
    }
    setName(tag, name) {
        this.proxy.setName(tag, name);
    }
    getValue(tag) {
        return this.proxy.getValue(tag);
    }
    setValue(tag, object) {
        this.proxy.setValue(tag, object);
    }
    //**********************************************************************
    // Public Methods (Properties, Locking)
    //**********************************************************************
    isLocked() {
        return this.proxy.isLocked();
    }
    //**********************************************************************
    // Public Methods (Properties, Focus)
    //**********************************************************************
    /* public 	isFocusing( tag?:string):boolean
    {
        if(tag){
            return this.proxy.isFocusing(tag);
        }
        else{
            return this.proxy.isFocusing();
        }
        
    }

    public setFocusing(b:boolean, tag:string):void
    {
        this.proxy.setFocusing(b, tag);
    }

    public setActiveFocusing(b:boolean, type?:string):void
    {
        if(b&& type){
        this.proxy.setActiveFocusing(b, type);
        }
        else{
            this.proxy.setActiveFocusing(b,undefined);
        }
    }

    

    //**********************************************************************
    // Public Methods (Properties, Editing)
    //**********************************************************************

    
    public 	isEditing(tag?:string):boolean
    {
        if(tag){
            return this.proxy.isEditing(tag);
        }
        else{
            return this.proxy.isEditing();
        }
        


        
    }

    public setEditing(b:boolean, tag:string):void
    {
        this.proxy.setEditing(b, tag);
    }

    public setActiveEditing(b:boolean, type:string):void
    {
        if(b&& type){
            this.proxy.setActiveEditing(b, type);
            }
            else{
                this.proxy.setActiveEditing(b,undefined);
            }


        
    }

    

    //**********************************************************************
    // Public Methods (Metastate)
    //**********************************************************************

    public 	isMetaFocusing():boolean
    {
        return this.proxy.isMetaFocusing();
    }

    public setMetaFocusing(b:boolean, object:object):void
    {
        this.proxy.setMetaFocusing(b, object);
    }

    public 	isMetaEditing():boolean
    {
        return this.proxy.isMetaEditing();
    }

    public setMetaEditing(b:boolean, object:object):void
    {
        this.proxy.setMetaEditing(b, object);
    }

    public 	isInteracting():boolean
    {
        return this.proxy.isInteracting();
    }

    public setInteracting( b:boolean):void
    {
        this.proxy.setInteracting(b);
    }

    public 	getLastInteractionTime():number
    {
        return this.proxy.getLastInteractionTime();
    }

    public setLastInteractionTime( lastInteractionTime:number):void
    {
        this.proxy.setLastInteractionTime(lastInteractionTime);
    }

    public touchInteraction():void
    {
        this.proxy.touchInteraction();
    }

    public getLastUpdateTime():number
    {
        return this.proxy.getLastUpdateTime();
    }

    public setLastUpdateTime(lastUpdateTime:number):void
    {
        this.proxy.setLastUpdateTime(lastUpdateTime);
    }

    public touchUpdate():void
    {
        this.proxy.touchUpdate();
    } */
    //**********************************************************************
    // Public Methods (Events)
    //**********************************************************************
    /**
     * Registers the specified ControlListener to receive ControlEvents
     * whenever a LiveProperty is added to or removed from this ControlInfo.
     */
    addControlListener(l) {
        this.proxy.addControlListener(l);
    }
    /**
     * Unregisters the specified ControlListener.
     */
    removeControlListener(l) {
        this.proxy.removeControlListener(l);
    }
}
//******************************************************************************
//# sourceMappingURL=ControlInfo.js.map

class ControlEvent {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(source, property) {
        this.source = source;
        this.property = property;
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getControl() {
        return this.source;
    }
    getLiveProperty() {
        return this.property;
    }
}
//******************************************************************************
//# sourceMappingURL=ControlEvent.js.map

class ControlProxy {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(control) {
        this.tags = []; //prototype names
        this.map = new Map(); // Tag->LiveProperty
        // Working (transient) variables
        //private const event: StateEvent;
        this.interacting = null;
        this.lastInteractionTime = null;
        this.lastUpdateTime = null;
        // Event Multicasters
        this.controlListeners = [];
        this.stateListeners = [];
        //if(printClass.printStatus) console.log("Hi I am in control proxy");
        //if(printClass.printStatus) console.log(control);
        this.control = control;
        this.info = new ControlInfo(this);
        this.tags = [];
        this.map = new Map();
        //event = new StateEvent(this);
        this.metaFocusingFlag = new SharedFlag();
        this.metaEditingFlag = new SharedFlag();
        //this.controlListeners = [4];
        //this.stateListeners = [4];
        if (printClass.printStatus)
            console.log("Second: ControlProxy Object Created");
        //if(printClass.printStatus) console.log(this);
    }
    //**********************************************************************
    // Getters and Setters
    //**********************************************************************
    getControl() {
        return this.control;
    }
    //**********************************************************************
    // Public Methods (Control)
    //**********************************************************************
    describe() {
        return this.info;
    }
    //**********************************************************************
    // Public Methods (Properties)
    //**********************************************************************
    /**
     * Returns a vector of all tags, in the order added.
     */
    getTags() {
        var s = [];
        s = this.tags;
        return s;
    }
    /**
     * Returns the number of tags.
     */
    getTagCount() {
        return this.tags.length;
    }
    /**
     * Returns the tag at the specified index.
     */
    getTagAt(index) {
        return this.tags[index];
    }
    /**
     * Returns where a tag is in the vector of all tags, or -1 if absent.
     */
    getIndexOfTag(tag) {
        return this.tags.indexOf(tag);
    }
    /**
     * Returns the LiveProperty associated with the specified tag, or null if
     * none exists.
     *
     * @param		tag		the name of the LiveProperty to retrieve
     */
    getLiveProperty(tag) {
        //if(printClass.printStatus) console.log(ControlProxy.map.get(tag));
        return this.map.get(tag);
    }
    /**
     * Returns a vector of all LiveProperties, in the order added.
     */
    getLiveProperties() {
        var properties = [];
        var i = 0;
        for (i = 0; i < properties.length; i++)
            properties[i] = this.map.get(this.tags[i]);
        return properties;
    }
    /**
     * Returns the property at the specified index.
     */
    getPropertyAt(index) {
        return this.map.get(this.tags[index]);
    }
    /**
     * Convenience method to register a listener with all current properties.
     * This does NOT automatically handle future addition and removal of
     * properties to the control. (Use ControlListener to detect such changes.)
     */
    addLivePropertyListener(l) {
        var n = this.tags.length;
        var i;
        for (i = 0; i < n; i++) {
            var tag = this.tags[i];
            var property = this.map.get(tag);
            property.addLivePropertyListener(l);
        }
    }
    /**
     * Convenience method to deregister a listener with all current properties.
     * This does NOT automatically handle future addition and removal of
     * properties to the control. (Use ControlListener to detect such changes.)
     */
    removeLivePropertyListener(l) {
        var n = this.tags.length;
        var i;
        for (i = 0; i < n; i++) {
            var tag = this.tags[i];
            var property = this.map.get(tag);
            property.removeLivePropertyListener(l);
        }
    }
    add(tag, prototype, interactive) {
        if (interactive) {
            if (this.map.has(tag))
                throw new Error("Duplicate tag: " + tag);
            var property = new LiveProperty(this.control, tag, prototype, interactive);
            //if(printClass.printStatus) console.log("I came back from live property to control proxy ");
            //if(printClass.printStatus) console.log(tag);
            //if(printClass.printStatus) console.log(property);
            this.tags.push(tag);
            //if(printClass.printStatus) console.log("I am in here ");
            this.map.set(tag, property);
            if (printClass.printStatus)
                console.log(this.map.get(tag)); //sending undefined value
            property.addLivePropertyListener(this.control);
            //if(printClass.printStatus) console.log("Hi")
            this.firePropertyAdded(new ControlEvent(this.control, property));
            return property;
        }
        else {
            if (this.map.has(tag))
                throw new Error("Duplicate tag: " + tag);
            var property = new LiveProperty(this.control, tag, prototype, false);
            this.tags.push(tag);
            this.map.set(tag, property);
            property.addLivePropertyListener(this.control);
            this.firePropertyAdded(new ControlEvent(this.control, property));
            return property;
        }
    }
    /* public add(tagPrefix: String, variant: Variant): void
    {
        var variables: string[] = new Array();

        variant.collectVariables(variables);

        var n: number = variables.length;
        var i: number;
        for (i = 0; i < n; i++)
        {
            var tag: string = tagPrefix + i.toString();
            var variable: Variable = variables[i];

            this.add(tag, variable.getPrototype());
            this.setVariable(tag, variable);
        }
    } */
    remove(tag) {
        var property = this.map.get(tag);
        if (property == null)
            throw new Error("Unknown tag: " + tag);
        //		if (!property.getInteractive() &&
        //			!Lexical.class.isAssignableFrom(property.getType()))
        //		{
        //			String			mtag = tag + ".Mutator";
        //			LiveProperty	mproperty = (LiveProperty)map.get(mtag);
        //			mproperty.removeLivePropertyListener(control);
        //			map.remove(mtag);
        //			tags.remove(mtag);
        //			firePropertyRemoved(new ControlEvent(control, mproperty));
        //			mproperty.dispose();
        //		}
        property.removeLivePropertyListener(this.control);
        this.map.delete(tag);
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.firePropertyRemoved(new ControlEvent(this.control, property));
        property.dispose();
    }
    removeAll() {
        while (this.tags.length > 0)
            this.remove(this.tags[this.tags.length - 1]);
    }
    //**********************************************************************
    // Public Methods (Properties, Variable Access)
    //********************************************************************* 
    getVariable(tag) {
        return this.getLiveProperty(tag).getVariable();
    }
    setVariable(tag, variable) {
        //if(printClass.printStatus) console.log(this.control);
        //if(printClass.printStatus) console.log("calling the variable:"+variable.name+" of liveproperty:"+this.getLiveProperty(tag).getName()+" of this:"+ ControlProxy.name +" object");
        //if(printClass.printStatus) console.log(tag);
        if (printClass.printStatus)
            console.log("setVariable Method of ControlProxy");
        if (printClass.printStatus)
            console.log(this.getLiveProperty(tag));
        if (printClass.printStatus)
            console.log(variable);
        this.getLiveProperty(tag).setVariable(variable);
        //if(printClass.printStatus) console.log(this.getLiveProperty(tag));
    }
    getName(tag) {
        return this.getLiveProperty(tag).getName();
    }
    setName(tag, name) {
        this.getLiveProperty(tag).setName(name);
    }
    getValue(tag) {
        var value = this.getLiveProperty(tag).getValue();
        return value;
    }
    setValue(tag, value) {
        console.log("is my server working");
        this.getLiveProperty(tag).setValue(value);
    }
    //**********************************************************************
    // Public Methods (Properties, Locking)
    //**********************************************************************
    isLocked() {
        var n = this.tags.length;
        var i;
        for (i = 0; i < n; i++) {
            var tag = this.tags[i].toString();
            var property = this.map.get(tag);
            if (property.getInteractive() && !property.isLocked())
                return false;
        }
        return true;
    }
    //**********************************************************************
    // Public Methods (Properties, Focusing)
    //**********************************************************************
    /*
        public isFocusing(): boolean
        {
            for (e: Enumeration = this.map.values(); e.hasMoreElements();) {
                if (((LiveProperty)e.nextElement()).this.isFocusing())
                return true;
    
                return false;
            }
    
        }
    
        public isFocusing(tag: string): boolean
        {
            return this.getLiveProperty(tag).isFocusing();
        }
    
        public setFocusing(b: boolean, tag: string): void
        {
            this.getLiveProperty(tag).setFocusing(b);
        }
    
        public setActiveFocusing(b: boolean, type: Class): void
        {
            var n: number = this.tags.length;
            var i: number;
            for (i = 0; i < n; i++)
            {
                var tag: string = this.tags[i].toString();
                var property: LiveProperty = this.map.get(tag);
    
                if (property.getInteractive() &&
                    ((type == null) || type.isAssignableFrom(property.getType())))
                    property.setFocusing(b);
            }
        }
    
        public setActiveFocusing(b: boolean): void
        {
            this.setActiveFocusing(b, null);
        }
    
        //**********************************************************************
        // Public Methods (Properties, Editing)
        //**********************************************************************
    
        public isEditing(): boolean
        {
            for (Enumeration e = this.map.values(); e.hasMoreElements();) {
                if ((e.nextElement()).this.isEditing())
                {
                    return true;
                }
                else
                {
                    return false;
                }
    
            }
    
        }
    
        public isEditing(tag: string): boolean
        {
            return this.getLiveProperty(tag).isEditing();
        }
    
        public setEditing(b: boolean, tag: string): void
        {
            this.getLiveProperty(tag).setEditing(b);
        }
    
        public setActiveEditing(b: boolean, type: Class): void
        {
            var n: number = this.tags.length;
            var i: number;
            for (i = 0; i < n; i++)
            {
                var tag: string = this.tags[i].toString();
                var property: LiveProperty = this.map.get(tag);
    
                if (property.getInteractive() &&
                    ((type == null) || type.isAssignableFrom(property.getType())))
                    property.setEditing(b);
            }
        }
    
        public setActiveEditing(b: boolean): void
        {
            this.setActiveEditing(b, null);
        }
    
        //**********************************************************************
        // Public Methods (Metastate)
        //**********************************************************************
    
        public isMetaFocusing(): boolean
        {
            return this.metaFocusingFlag.getState();
        }
    
        public setMetaFocusing(b: boolean, object: Object): void
        {
            if (this.metaFocusingFlag.setState(b, object))
                this.fireStateChanged();
        }
    
        public isMetaEditing(): boolean
        {
            return this.metaEditingFlag.getState();
        }
    
        public setMetaEditing(b: boolean, object: Object): void
        {
            if (this.metaEditingFlag.setState(b, object))
                this.fireStateChanged();
        }
    
        public isInteracting(): boolean
        {
            return this.interacting;
        }
    
        public setInteracting(interacting: boolean): void
        {
            if (this.interacting == interacting)
                return;
    
            this.interacting = interacting;
    
            this.fireStateChanged();
        }
    
        public getLastInteractionTime(): number
        {
            return this.lastInteractionTime;
        }
    
        public setLastInteractionTime(lastInteractionTime: number): void
        {
            if (this.lastInteractionTime == lastInteractionTime)
                return;
    
            this.lastInteractionTime = lastInteractionTime;
    
            //fireStateChanged();
        }
    
        public touchInteraction(): void
        {
            this.lastInteractionTime = Date.now();
        }
    
        public getLastUpdateTime(): number
        {
            return this.lastUpdateTime;
        }
    
        public setLastUpdateTime(lastUpdateTime: number): void
        {
            if (this.lastUpdateTime == lastUpdateTime)
                return;
    
            this.lastUpdateTime = lastUpdateTime;
    
            //fireStateChanged();
        }
    
        public touchUpdate(): void
        {
            this.lastUpdateTime = Date.now();
        } */
    //**********************************************************************
    // Public Methods (Events)
    //**********************************************************************
    /**
     * Registers the specified ControlListener to receive ControlEvents
     * whenever a LiveProperty is added to or removed from this this.
     */
    addControlListener(l) {
        this.controlListeners.push(l);
    }
    /**
     * Unregisters the specified ControlListener.
     */
    removeControlListener(l) {
        this.controlListeners.splice(this.controlListeners.indexOf(l.toString()), 1);
    }
    /* 	public addStateListener(l: StateListener): void
        {
            this.stateListeners.push(l);
        }
    
        public removeStateListener(l: StateListener): void
        {
            this.stateListeners.splice(this.stateListeners.indexOf(l.toString()),1);
            
        }
     */
    //**********************************************************************
    // Override Methods (Disposable)
    //**********************************************************************
    dispose() {
        while (this.tags.length > 0) {
            var tag = this.tags[this.tags.length - 1].toString();
            if (!tag.endsWith(".Mutator"))
                this.remove(tag);
        }
        this.controlListeners.splice(0, this.controlListeners.length);
        this.stateListeners.splice(0, this.stateListeners.length);
    }
    //**********************************************************************
    // Private Methods (Events)
    //**********************************************************************
    firePropertyAdded(e) {
        //if(printClass.printStatus) console.log("I am in firePropertyAdded method of this");
        var n = this.controlListeners.length;
        var i;
        for (i = 0; i < n; i++)
            (this.controlListeners[i]).propertyAdded(e);
    }
    firePropertyRemoved(e) {
        var n = this.controlListeners.length;
        var i;
        for (i = 0; i < n; i++)
            (this.controlListeners[i]).propertyRemoved(e);
    }
    fireStateChanged() {
        var n = this.stateListeners.length;
        var i;
        for (i = 0; i < n; i++)
            (this.stateListeners[i]).stateChanged(event);
    }
}
//******************************************************************************
//# sourceMappingURL=ControlProxy.js.map

//Draggable class to make the html div elements draggable
//source : https://www.w3schools.com/howto/howto_js_draggable.asp
class Draggable {
    dragElement(elmnt) {
        if (elmnt == null) {
        }
        else {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
                /* if present, the header is where you move the DIV from:*/
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            }
            else {
                /* otherwise, move the DIV from anywhere inside the DIV:*/
                elmnt.onmousedown = dragMouseDown;
            }
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = elmnt.offsetTop - pos2 + "px";
                elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
            }
            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
}
/*
window.onload = addListeners;

function addListeners() {
  //if (window.addEventListener) {
    //Event listeners for draggable windows
    document.getElementById("box1header")!.addEventListener('mousedown', dragElement(document.getElementById("box1")), false);
    document.getElementById("box2header")!.addEventListener('mousedown', dragElement(document.getElementById("box2")), false);
    document.getElementById("fontvalueheader")!.addEventListener('mousedown', dragElement(document.getElementById("fontvalue")), false);
    document.getElementById("sentance1header")!.addEventListener('mousedown', dragElement(document.getElementById("sentance1")), false);
    document.getElementById("Referenceheader")!.addEventListener('mousedown', dragElement(document.getElementById("Reference")), false);
    document.getElementById("Rectangleheader")!.addEventListener('mousedown', dragElement(document.getElementById("Rectangle")), false);
    document.getElementById("sliderheader")!.addEventListener('mousedown', dragElement(document.getElementById("slider")), false);

    //update the elements based on new slider value
    //document.getElementById("myRange").addEventListener('input', sliderControl, false);

    //update the elements based on new pixel value
    //document.getElementById("fontValue").addEventListener('input', pixelControl, false);

    //update the elements based on new text area1 value
    document.getElementById("text1")!.addEventListener('input', textAreaControl, false);

    //update the elements based on new text area2 value
    document.getElementById("text2")!.addEventListener('input', textAreaControl, false);


  //}
  /* else if (window.attachEvent) {
    //document.getElementById("myRange").attachEvent('oninput', sliderEvent);
  } */
//}
/*
//print alert for html body
function PrintAlert() {
  alert("This document is now being printed");
}






 //create control
var sliderCounter = 0;
var fontvalueCounter = 0;

function createControl(control:string){
  //console.log("slider in progress");
  //console.log("pixel class case")
switch(control){

  case "slider":
    //console.log("slider in progress");
    if(sliderCounter==0){
      //s1= new SliderClass(50);
      //console.log("new sliderClass Created");
      new sliderClass(50).createSlider();
      sliderCounter++;
    }
    else
    {
    console.log("Existing Class Used");
    new sliderClass(50).createSlider();
    }
    break;

  case "fontvalue":
    //console.log("pixel class case")
    if(fontvalueCounter==0){
      new PixelClass(50).createPixelvalue();
      //console.log("new sliderClass Created");
      //p1.createPixelvalue();
      fontvalueCounter++;
    }
    else
    {
    console.log("Existing Class Used");
    new PixelClass(50).createPixelvalue();
    }
    break;




  }

} */
//create variable
/* createVariable = function(type, value){

  if(v1){
    v1.update(type,value);
  }
  else{
    v1 = new variable();
    v1.update(type,value);
  }

}


bind = function(controlname, variable){


  document.getElementById(controlname).addEventListener('input', bindVariable(variable), false);

  bindVariable = function(variable){



  }


}
 */
//# sourceMappingURL=Draggable.js.map

class Eventing {
    constructor() {
        this.events = {};
    }
    on(eventName, callback) {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }
    /* trigger(value: number): void
    {
        this.slider.setValue = value;
    } */
    trigger(eventName) {
        const handlers = this.events[eventName];
        if (!handlers || handlers.length === 0) {
            return;
        }
        handlers.forEach(callback => {
            callback();
        });
    }
}
//# sourceMappingURL=Eventing.js.map

//inspired from Jslider class
class SliderClass extends Eventing {
    //private firstStart:boolean = true;
    //**********************************************************************
    // Constructor
    //**********************************************************************
    constructor(name) {
        super();
        //events:{[key:string]:Callback[]} ={};
        //**********************************************************************
        // Private Class Members
        //**********************************************************************
        this.name = "slider";
        //this.tag = tag;
        this.min = 0;
        this.max = 100;
        this.value = 50;
        this.sliderControlName = name;
        this.updateUI();
        if (printClass.printStatus)
            console.log("slider object created");
        //if(printClass.printStatus) console.log(this);
    }
    //************************
    // Getters and Setters
    //************************
    getMin() {
        return this.min;
    }
    getMax() {
        return this.max;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        if (printClass.printStatus)
            console.log("setValue method of Slider");
        //if(value>=this.min && value <=this.min){
        this.value = value;
        //**************************need to implement fire property changed method**********************************
        //this.updateUI();
        if (printClass.printStatus)
            console.log(this.sliderControlName);
        const IPelement = document.getElementById("myRange" + this.sliderControlName);
        IPelement.value = this.value;
        if (printClass.printStatus)
            console.log("successfully updated the variable");
        /*  else{
             throw Error("Value noot in bounds")
         } */
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    //******************
    //public Methods
    //*****************
    updateUI() {
        //create a div element to hold slider
        var div1 = document.createElement("div");
        div1.id = this.sliderControlName;
        div1.className = "slider";
        var numberPattern = /\d+/g;
        div1.style.left = (parseInt(this.sliderControlName.match(numberPattern).toString()) - 1) * 300 + "px";
        //div1.style.left = Math.random()*1500 + "px"; 
        //create a closable icon
        var div0 = document.createElement("button");
        div0.id = "close";
        div0.innerHTML = "X";
        div0.title = "close";
        div0.onclick = function () { div0.parentNode.parentNode.removeChild(div0.parentNode); return false; };
        div1.appendChild(div0);
        //create a div header for the slider
        var div2 = document.createElement("div");
        div2.id = div1.id + "header";
        div2.className = "sliderheader";
        div2.textContent = div1.id;
        //make the div element a child to the header
        div1.appendChild(div2);
        //Add additional information to the control and append it
        var h = document.createElement("h2");
        h.textContent = "Font size based on the slider";
        div1.appendChild(h);
        if (printClass.printStatus)
            console.log(this.sliderControlName);
        //create a slider inside the div element and make it a child
        var slider = document.createElement('input');
        slider.id = "myRange" + this.sliderControlName;
        //console.log(slider.id);
        slider.type = 'range';
        slider.min = "0";
        slider.max = "100";
        slider.value = "this.current";
        slider.step = "1";
        div1.appendChild(slider);
        //add the div element to the document body
        document.body.appendChild(div1);
        //call the make draggable function
        this.makeDraggable();
        //this.attachEventListener(slider.id);
        //if(printClass.printStatus) console.log(this.value);
        //this.firstStart = false;
        return this;
    }
    makeDraggable() {
        //create instance of a Draggable class
        var D1 = new Draggable();
        var temp = this.sliderControlName;
        //const myElement: HTMLElement | null = document.getElementById(this.name);
        //check if the element that needs to be made draggable exist, else throw error        
        try {
            //if we remove the function() before D1.dragElement then this keyword refers to the html element that we are adding the 
            //event listener on , otherwise this keyword refers to the sliderClass object
            //document.getElementById( SliderClass.sliderControlName + "header")!
            //    .addEventListener('mousedown', D1.dragElement(document.getElementById( this.sliderControlName)), false);
            document.getElementById(this.sliderControlName + "header")
                .addEventListener('mousedown', function () { D1.dragElement(document.getElementById(temp)); }, false);
        }
        catch (error) {
            throw Error("The Element by id " + this.sliderControlName + " do not exist");
        }
    }
}
//# sourceMappingURL=slider.js.map

class ControlSlider {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(name) {
        // test(evt: Event): void
        // {
        //     throw new Error("Method not implemented.");
        // }
        //**********************************************************************
        // Public Class Members (Properties)
        //**********************************************************************
        this.CTAG_VALUE = "Value";
        this.TYPE_VALUE = new Prototype(Number.prototype, this.CTAG_VALUE, 0);
        //Create Control Proxy
        //if(printClass.printStatus) console.log(this.TYPE_VALUE);
        this.proxy = new ControlProxy(this);
        //create live property
        this.live_property = this.proxy.add(this.CTAG_VALUE, this.TYPE_VALUE, true);
        if (printClass.printStatus)
            console.log(this.live_property);
        this.ControlName = name;
        this.slider = new SliderClass(name);
        if (printClass.printStatus)
            console.log(name);
        //create the variables pproxy and ttag to be used in add event listener as we cannot use this 
        //keyword to access the current class i.e control slider inside the add event listener method.
        var pproxy = this.proxy;
        var ttag = this.CTAG_VALUE;
        document.getElementById("myRange" + name).addEventListener("input", function () {
            pproxy.getLiveProperty(ttag).setValue(parseInt(this.value));
            //if(printClass.printStatus) console.log("hurray");
        });
    }
    notifyslider(e) {
        //const vary = ;
        if (printClass.printStatus)
            console.log("I am in notifyslider method of controlSlider");
        //if(printClass.printStatus) console.log(this.getsupport());
        this.proxy.getLiveProperty(this.CTAG_VALUE).setVariable(e.target.value);
    }
    //**********************************************************************
    // Public Methods (Properties)
    //**********************************************************************
    getValue() {
        return (this.proxy.getValue(this.CTAG_VALUE));
    }
    setValue(value) {
        this.proxy.setValue(this.CTAG_VALUE, value);
        this.slider.setValue(value);
    }
    //**********************************************************************
    // Override Methods (ChangeListener)
    //**********************************************************************
    stateChanged(e) {
        var value = this.slider.getValue();
        if (value != this.getValue())
            this.setValue(value);
    }
    //**********************************************************************
    // Override Methods (LivePropertyListener)
    //**********************************************************************
    propertyChanged(e) {
        if (printClass.printStatus)
            console.log("propertyChanged method of controlSlider");
        if (printClass.printStatus)
            console.log(e);
        var tag = e.getLiveProperty().getTag();
        if (printClass.printStatus)
            console.log(tag);
        var ve = e.getVariableEvent();
        if (printClass.printStatus)
            console.log(ve); //this value should not be null
        //if(printClass.printStatus) console.log(ve.getType());
        if (printClass.printStatus)
            console.log(VariableEvent.VALUE_CHANGED);
        //if ((ve == null) || (ve.getType() == VariableEvent.VALUE_CHANGED))
        //{
        if (tag == this.CTAG_VALUE) {
            //if(printClass.printStatus) console.log("hurray ControlSlider")
            if (printClass.printStatus)
                console.log(e.getLiveProperty().variable.getPrototype().value);
            //var	value:typeOfValue = this.getValue();
            //if(printClass.printStatus) console.log(value);
            //if (this.slider.getValue() != value)
            if (printClass.printStatus)
                console.log(e.getLiveProperty().getVariable().getValue());
            this.slider.setValue(e.getLiveProperty().getVariable().getValue());
            // this.slider.setValue(90);
        }
        //} 
    }
    propertyChangeToUpdateUI(value) {
        //if(printClass.printStatus) console.log(e);
        this.slider.setValue(value);
    }
    //**********************************************************************
    // Private Methods (Graphics)
    //**********************************************************************
    describe() {
        throw new Error("Method not implemented.");
    }
    dispose() {
        throw new Error("Method not implemented.");
    }
}
//******************************************************************************
//# sourceMappingURL=ControlSlider.js.map

//inspired from Jslider class
class PixelClass {
    //static control:ControlPixel;
    //**********************************************************************
    // Constructor
    //**********************************************************************
    constructor(name) {
        this.events = {};
        this.name = "pixel";
        //PixelClass.control = control;
        this.pixelvalue = 0;
        this.pixelControlName = name;
        this.updateUI();
        if (printClass.printStatus)
            console.log("Third:" + this.name + " object created");
        //if(printClass.printStatus) console.log(this);
    }
    getValue() {
        return this.pixelvalue;
    }
    setValue(value) {
        //if(value>=this.min && value <=this.min){
        this.pixelvalue = value;
        //**************************need to implement fire property changed method**********************************
        //this.updateUI();
        const element = document.getElementById("myValue" + this.pixelControlName);
        element.value = this.pixelvalue;
        if (printClass.printStatus)
            console.log("successfully updated the variable");
        return;
        /*  else{
             throw Error("Value not in bounds")
         } */
    }
    getName() {
        return this.name;
    }
    set setName(name) {
        this.name = name;
    }
    updateUI() {
        /*        if(this.pixels.indexOf(newname)>-1){
                   throw Error("Name Already Exists");
               }
               else{
                   this.name = newname;
                   this.pixels.push(newname);
               }
                */
        var div1 = document.createElement("div");
        div1.id = this.pixelControlName;
        div1.className = "fontvalue";
        var numberPattern = /\d+/g;
        div1.style.left = parseInt(this.pixelControlName.match(numberPattern).toString()) * 200 + "px";
        //console.log(this.pixelControlName.match(numberPattern));
        //create a closable icon
        var div0 = document.createElement("button");
        div0.id = "close";
        div0.title = "close";
        div0.innerHTML = "X";
        div0.onclick = function () { div0.parentNode.parentNode.removeChild(div0.parentNode); return false; };
        div1.appendChild(div0);
        var div2 = document.createElement("div");
        div2.id = div1.id + "header";
        div2.className = "fontvalueheader";
        div2.textContent = div1.id;
        div1.appendChild(div2);
        var h = document.createElement("h2");
        h.textContent = "Font size in Pixels";
        div1.appendChild(h);
        if (printClass.printStatus)
            console.log(this.name);
        var fontControl = document.createElement('input');
        fontControl.id = "myValue" + this.pixelControlName;
        fontControl.type = 'number';
        fontControl.min = "0";
        fontControl.max = "100";
        fontControl.value = "50";
        //document.body.appendChild(fontControl); 
        div1.appendChild(fontControl);
        document.body.appendChild(div1);
        this.makeDraggable();
        return this;
    }
    makeDraggable() {
        var D1 = new Draggable();
        //var D1 = new Draggable();
        var temp = this.pixelControlName;
        try {
            document.getElementById(this.pixelControlName + "header")
                .addEventListener('mousedown', function () { D1.dragElement(document.getElementById(temp)); }, false);
        }
        catch (error) {
            throw Error("The Element by id " + this.pixelControlName + " do not exist");
        }
    }
}
//# sourceMappingURL=pixel.js.map

class ControlPixel {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(name) {
        //**********************************************************************
        // Public Class Members (Properties)
        //**********************************************************************
        //events:{[key:string]:Callback[]} ={};
        this.CTAG_VALUE = "Value";
        this.TYPE_VALUE = new Prototype(Number.prototype, this.CTAG_VALUE, 0);
        this.proxy = new ControlProxy(this);
        this.live_property = this.proxy.add(this.CTAG_VALUE, this.TYPE_VALUE, true);
        this.ControlName = name;
        this.Pixel = new PixelClass(name);
        //create the variables pproxy and ttag to be used in add event listener as we cannot use this 
        //keyword to access the current class i.e control slider inside the add event listener method.
        var pproxy = this.proxy;
        var ttag = this.CTAG_VALUE;
        document.getElementById("myValue" + name).addEventListener("input", function () { pproxy.getLiveProperty(ttag).setValue(parseInt(this.value)); });
    }
    //**********************************************************************
    // Public Methods (Properties)
    //**********************************************************************
    getValue() {
        return (this.proxy.getValue(this.CTAG_VALUE));
    }
    setValue(value) {
        this.proxy.setValue(this.CTAG_VALUE, value);
        this.Pixel.setValue(value);
    }
    //**********************************************************************
    // Override Methods (ChangeListener)
    //**********************************************************************
    stateChanged(e) {
        var value = this.Pixel.getValue();
        if (value != this.getValue())
            this.setValue(value);
    }
    //**********************************************************************
    // Override Methods (LivePropertyListener)
    //**********************************************************************
    propertyChanged(e) {
        if (printClass.printStatus)
            console.log("I am in property changed method of control Pixel");
        if (printClass.printStatus)
            console.log(e);
        var tag = e.getLiveProperty().getTag();
        if (printClass.printStatus)
            console.log(tag);
        var ve = e.getVariableEvent();
        if (printClass.printStatus)
            console.log(ve);
        //if ((ve == null) || (ve.getType == VariableEvent.VALUE_CHANGED))
        //{
        if (tag == this.CTAG_VALUE) {
            if (printClass.printStatus)
                console.log("hurray");
            if (printClass.printStatus)
                console.log(e.getLiveProperty().variable.getPrototype().value);
            //var	value:typeOfValue = this.getValue();
            //if(printClass.printStatus) console.log(value);
            //if (this.slider.getValue() != value)
            //if(printClass.printStatus) console.log(e.getLiveProperty().getVariable().getValue());
            this.Pixel.setValue(e.getLiveProperty().getVariable().getValue());
            //this.Pixel.setValue(e.getLiveProperty().getVariable().getValue());
        }
        //}
    }
    //**********************************************************************
    // Private Methods (Graphics)
    //**********************************************************************
    describe() {
        throw new Error("Method not implemented.");
    }
    dispose() {
        throw new Error("Method not implemented.");
    }
}
//******************************************************************************
//# sourceMappingURL=ControlPixel.js.map

//inspired from Jslider class
class CanvasClass {
    //**********************************************************************
    // Constructor
    //**********************************************************************
    constructor(name) {
        //events:{[key:string]:Callback[]} ={};
        //**********************************************************************
        // Private Class Members
        //**********************************************************************
        this.name = "canvas";
        this.height = 400;
        this.width = 400;
        this.canvasControlName = name;
        this.updateUI();
        if (printClass.printStatus)
            console.log("rectangle object created");
        //if(printClass.printStatus) console.log(this);
    }
    //************************
    // Getters and Setters
    //************************
    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    setHeight(value) {
        if (printClass.printStatus)
            console.log("set Height method of Canvas");
        if (printClass.printStatus)
            console.log(value);
        //if(value>=this.min && value <=this.min){
        this.height = value;
        //**************************need to implement fire property changed method**********************************
        //this.updateUI();
        if (printClass.printStatus)
            console.log(this.canvasControlName);
        const IPelement = document.getElementById("myCanvas" + this.canvasControlName);
        //IPelement.height = this.height*4;
        var temp = this.height;
        IPelement.height = temp * 4;
        IPelement.getContext("2d").fillRect(0, 0, temp * 4, temp * 4);
        if (printClass.printStatus)
            console.log("successfully updated the variable");
        /*  else{
             throw Error("Value not in bounds")
         } */
    }
    setWidth(value) {
        if (printClass.printStatus)
            console.log("set width method of Canvas");
        if (printClass.printStatus)
            console.log(value);
        //if(value>=this.min && value <=this.min){
        this.width = value;
        //**************************need to implement fire property changed method**********************************
        //this.updateUI();
        if (printClass.printStatus)
            console.log(this.canvasControlName);
        const IPelement = document.getElementById("myCanvas" + this.canvasControlName);
        var temp = this.width;
        IPelement.width = temp * 4;
        IPelement.getContext("2d").fillRect(0, 0, temp * 4, temp * 4);
        if (printClass.printStatus)
            console.log("successfully updated the variable");
        /*  else{
             throw Error("Value not in bounds")
         } */
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    //******************
    //public Methods
    //*****************
    updateUI() {
        //create a div element to hold slider
        var div1 = document.createElement("div");
        div1.id = this.canvasControlName;
        div1.className = "canvas";
        var numberPattern = /\d+/g;
        div1.style.left = (parseInt(this.canvasControlName.match(numberPattern).toString()) - 1) * 400 + "px";
        //div1.style.left = Math.random()*2000 + "px";
        //create a closable icon
        var div0 = document.createElement("button");
        div0.id = "close";
        div0.innerHTML = "X";
        div0.title = "close";
        div0.onclick = function () { div0.parentNode.parentNode.removeChild(div0.parentNode); return false; };
        div1.appendChild(div0);
        //create a div header for the slider
        var div2 = document.createElement("div");
        div2.id = div1.id + "header";
        div2.className = "canvasheader";
        div2.textContent = div1.id;
        //make the div element a child to the header
        div1.appendChild(div2);
        //Add additional information to the control and append it
        var h = document.createElement("h2");
        //h.textContent = "Rectangle size based on the slider";
        div1.appendChild(h);
        //if(printClass.printStatus)     console.log(this.canvasControlName);
        //create a slider inside the div element and make it a child
        var canvas_ = document.createElement('canvas');
        canvas_.id = "myCanvas" + this.canvasControlName;
        //slider.type = 'ca';
        canvas_.height = 400;
        canvas_.width = 400;
        //var ccanvas = document.g 
        //var ctx = 
        canvas_.getContext("2d").fillStyle = "green";
        canvas_.getContext("2d").fillRect(0, 0, canvas_.height, canvas_.width);
        div1.appendChild(canvas_);
        //add the div element to the document body
        document.body.appendChild(div1);
        //call the make draggable function
        this.makeDraggable();
        //this.attachEventListener(slider.id);
        //if(printClass.printStatus) console.log(this.value);
        return this;
    }
    getSUpport() {
        if (printClass.printStatus)
            console.log("support Recieved");
    }
    makeDraggable() {
        //create instance of a Draggable class
        var D1 = new Draggable();
        var temp = this.canvasControlName;
        //const myElement: HTMLElement | null = document.getElementById(this.name);
        //check if the element that needs to be made draggable exist, else throw error        
        try {
            //if we remove the function() before D1.dragElement then this keyword refers to the html element that we are adding the 
            //event listener on , otherwise this keyword refers to the sliderClass object
            //document.getElementById( SliderClass.sliderControlName + "header")!
            //    .addEventListener('mousedown', D1.dragElement(document.getElementById( this.sliderControlName)), false);
            document.getElementById(this.canvasControlName + "header")
                .addEventListener('mousedown', function () { D1.dragElement(document.getElementById(temp)); }, false);
        }
        catch (error) {
            throw Error("The Element by id " + this.canvasControlName + " do not exist");
        }
    }
}
//# sourceMappingURL=canvas.js.map

class ControlCanvas {
    //**********************************************************************
    // Constructors and Finalizer
    //**********************************************************************
    constructor(name) {
        // test(evt: Event): void
        // {
        //     throw new Error("Method not implemented.");
        // }
        //**********************************************************************
        // Public Class Members (Properties)
        //**********************************************************************
        this.CTAG_Height = "Height";
        this.CTAG_Width = "Width";
        this.TYPE_Height = new Prototype(Number.prototype, this.CTAG_Height, 0);
        this.TYPE_Width = new Prototype(Number.prototype, this.CTAG_Width, 0);
        //Create Control Proxy
        //if(printClass.printStatus) console.log(this.TYPE_VALUE);
        this.proxy = new ControlProxy(this);
        //create live property
        this.live_property1 = this.proxy.add(this.CTAG_Height, this.TYPE_Height, true);
        this.live_property2 = this.proxy.add(this.CTAG_Width, this.TYPE_Width, true);
        if (printClass.printStatus)
            console.log(this.live_property1);
        if (printClass.printStatus)
            console.log(this.live_property2);
        this.ControlName = name;
        this.canvas = new CanvasClass(name);
        if (printClass.printStatus)
            console.log(name);
        //create the variables pproxy and ttag to be used in add event listener as we cannot use this 
        //keyword to access the current class i.e control slider inside the add event listener method.
        var pproxy = this.proxy;
        var ttagH = this.CTAG_Height;
        var ttagW = this.CTAG_Width;
        // document.getElementById("myCanvas" + name).addEventListener("click", function(event)
        // {
        //     pproxy.getLiveProperty(ttagH).setValue(event.screenX);
        //     if(printClass.printStatus) console.log(event.clientX);
        //     pproxy.getLiveProperty(ttagW).setValue(event.screenY);
        //     if(printClass.printStatus) console.log(event.clientY);
        // } );
    }
    //**********************************************************************
    // Public Methods (Properties)
    //**********************************************************************
    getHeight() {
        return (this.proxy.getValue(this.CTAG_Height));
    }
    setHeight(value) {
        this.proxy.setValue(this.CTAG_Height, value);
        //this.canvas.setValue(value);
    }
    getWidth() {
        return (this.proxy.getValue(this.CTAG_Width));
    }
    setWidth(value) {
        this.proxy.setValue(this.CTAG_Width, value);
        //this.canvas.setValue(value);
    }
    //**********************************************************************
    // Override Methods (ChangeListener)
    //**********************************************************************
    // public stateChanged(e: Event): void
    // {
    //     var value: typeOfValue = this.canvas.getValue();
    //     if (value != this.getValue())
    //         this.setValue(value);
    // }
    //**********************************************************************
    // Override Methods (LivePropertyListener)
    //**********************************************************************
    propertyChanged(e) {
        if (printClass.printStatus)
            console.log("propertyChanged method of controlSlider");
        if (printClass.printStatus)
            console.log(e);
        var tag = e.getLiveProperty().getTag();
        if (printClass.printStatus)
            console.log(tag);
        var ve = e.getVariableEvent();
        if (printClass.printStatus)
            console.log(ve); //this value should not be null
        if (printClass.printStatus)
            console.log(ve.getType());
        if (printClass.printStatus)
            console.log(VariableEvent.VALUE_CHANGED);
        //if ((ve == null) || (ve.getType() == VariableEvent.VALUE_CHANGED))
        //{
        if (tag == this.CTAG_Height) {
            if (printClass.printStatus)
                console.log("hurray ControlCanvas height");
            if (printClass.printStatus)
                console.log(e.getLiveProperty().variable.getPrototype().value);
            //var	value:typeOfValue = this.getValue();
            //if(printClass.printStatus) console.log(value);
            //if (this.slider.getValue() != value)
            if (printClass.printStatus)
                console.log(e.getLiveProperty().getVariable().getValue());
            this.canvas.setHeight(e.getLiveProperty().getVariable().getValue());
            // this.slider.setValue(90);
        }
        else if (tag == this.CTAG_Width) {
            if (printClass.printStatus)
                console.log("hurray ControlCanvas Width");
            if (printClass.printStatus)
                console.log(e.getLiveProperty().variable.getPrototype().value);
            //var	value:typeOfValue = this.getValue();
            //if(printClass.printStatus) console.log(value);
            //if (this.slider.getValue() != value)
            if (printClass.printStatus)
                console.log(e.getLiveProperty().getVariable().getValue());
            this.canvas.setWidth(e.getLiveProperty().getVariable().getValue());
            // this.slider.setValue(90);
        }
        //} 
    }
    propertyChangeToUpdateUI(value) {
        //if(printClass.printStatus) console.log(e);
        //this.canvas.setValue(value);
        console.log(value);
    }
    //**********************************************************************
    // Private Methods (Graphics)
    //**********************************************************************
    describe() {
        throw new Error("Method not implemented.");
    }
    dispose() {
        throw new Error("Method not implemented.");
    }
}
//******************************************************************************
//# sourceMappingURL=ControlCanvas.js.map

//console.info('%cThis is implementation of LiveProperties in Javascript','color:blue; font-weight:bold; font-size:15px');
//console.warn("This may not work in all browsers!.  This is an experemental project ");
var sliderCounter = 0;
var pixelCounter = 0;
//editorManager.java
//variablePanel
//ToDO:  Create a Singleton Class for Controls 
function createControl(controlName, name) {
    if (printClass.printStatus)
        console.log("Next Step: Control Creation**************(( " + controlName + " ))**************");
    if (controlName == "slider") {
        sliderCounter = sliderCounter + 1;
        var sliderControl = new ControlSlider(name);
        //if(printClass.printStatus) console.log("number of sliders:"+ sliderCounter);
        //sliderControl.on
        return sliderControl;
    }
    else if (controlName == "pixel") {
        pixelCounter = pixelCounter + 1;
        var pixelControl = new ControlPixel(name);
        //if(printClass.printStatus) console.log("number of pixelcontrols:"+ sliderCounter);
        //sliderControl.on
        return pixelControl;
    }
    else if (controlName == "canvas") {
        //pixelCounter = pixelCounter +1; 
        var canvasControl = new ControlCanvas(name);
        //if(printClass.printStatus) console.log("number of pixelcontrols:"+ sliderCounter);
        //sliderControl.on
        return canvasControl;
    }
    else {
        throw Error("Control Doesnot exist yet");
    }
}
function createVariable(variableName, value) {
    if (printClass.printStatus)
        console.log("Next Step:Variable Creation*************(( " + variableName + " ))***********");
    var CUR_TAG = "Value";
    //if you don't want to pass parameters use placeholder undefined
    var CUR_VALUE = new Prototype(Number.prototype, CUR_TAG, undefined, undefined);
    //if(printClass.printStatus) console.log("Returned to index.js");
    var variable = new Variable(CUR_VALUE, variableName, value);
    //if(printClass.printStatus) console.log(variable);
    return variable;
}
function bindVariable(control, property, variable) {
    //console.clear();
    if (printClass.printStatus)
        console.log(control);
    if (printClass.printStatus)
        console.log("Next step:*************************** Binding (( " + variable.name + " )) to (( " + control.ControlName + " ))******************");
    control.proxy.setVariable(property, variable);
}
//Define Control Types
var Slider_type = "slider";
var Pixel_type = "pixel";
var Canvas_type = "canvas";
//create Controls
var slider1 = createControl(Slider_type, "slider1");
var slider2 = createControl(Slider_type, "slider2");
var slider3 = createControl(Slider_type, "slider3");
var slider4 = createControl(Slider_type, "slider4");
var pixel1 = createControl(Pixel_type, "pixel1");
var pixel2 = createControl(Pixel_type, "pixel2");
var pixel3 = createControl(Pixel_type, "pixel3");
var pixel4 = createControl(Pixel_type, "pixel4");
var canvas1 = createControl(Canvas_type, "canvas1");
var canvas2 = createControl(Canvas_type, "canvas2");
var canvas3 = createControl(Canvas_type, "canvas3");
//var canvas4 = createControl(Canvas_type,"canvas4");
// variable creation
var variable1 = createVariable("variable1", 50);
var variable2 = createVariable("variable2", 90);
var variable3 = createVariable("variable3", 60);
//var variable4 = createVariable("variable4", 835);
//var variable5 = createVariable("variable5", 443);
//Variable binding to live property of control
bindVariable(slider1, "Value", variable1);
bindVariable(slider2, "Value", variable3);
bindVariable(slider3, "Value", variable2);
bindVariable(slider4, "Value", variable2);
//Variable binding to live property of control
bindVariable(pixel1, "Value", variable1);
bindVariable(pixel2, "Value", variable3);
bindVariable(pixel3, "Value", variable2);
bindVariable(pixel4, "Value", variable2);
bindVariable(canvas1, "Height", variable1);
bindVariable(canvas1, "Width", variable1);
bindVariable(canvas2, "Height", variable3);
bindVariable(canvas2, "Width", variable3);
bindVariable(canvas3, "Height", variable1);
bindVariable(canvas3, "Width", variable2);
