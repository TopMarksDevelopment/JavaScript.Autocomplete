# Autocomplete (A JavaScript package)

A small package to provide an autocomplete list as a user is typing.

### Links

-   [Options](#options)
    -   [Option Methods](#option-methods)
-   [Change log](./CHANGELOG.md)
-   [License (MIT)](./LICENSE)

## Usage

### Basic usage

To add autocomplete to an input with the class "`autocomplete`", use the sample code below - which will query the specified source URL and expect a JSON response.

Without specifying a type, autocomplete defaults to the generic type:  
`{ label: string; value: string }`

```TS
// Using the default options (source is always required)
new Autocomplete(
    '.autocomplete',
    {
        source: './relative-folder/query.html'
    }
)
    // Don't forget to start it
    .start();
```

<details><summary>
<h3>Custom source type</h3>
</summary>

You can also specify the source type for some strong types!

In this example I've provided an array of inputs (that will always be returned) - this is also strongly typed!

```TS
type MyType = {
    myCustomName: string;
    myCustomValue: string;
}

// Using the custom MyType (which is now tightly-bound)
new Autocomplete<MyType>(
    '.autocomplete',
    {
        source: [
            {
                myCustomName: "One - Name",
                myCustomValue: "One - Value"
            },
            {
                myCustomName: "Two - Name",
                myCustomValue: "Two - Value"
            },
            {
                myCustomName: "Three - Name",
                myCustomValue: "Three - Value"
            },
        ]
    },
    renderers: {
        itemRenderer: ({ item }) =&gt; {
            const li = document.createElement('li');

            li.dataset.value = item.myCustomName;

            //li.innerText = item.detail; <-- This isn't in `MyType`

            li.innerText = item.myCustomValue;

            return li;
        },
    }
)
    // Don't forget to start it
    .start();
```

</details>

## Options

### source: `SourceTypes<T>`

The source of the autocompelte data

#### `SourceTypes<T>`

-   `string`  
    a URL we will `GET` with a `term` querystring parameter (expects a JSON response)
-   `Record` set  
    an object with string keys and values, treated as label, value respectively
-   `string[]`  
    an array of strings with each item treated as both the value and label
-   `T[]`  
    an array of the generic type (if specified)
-   `function(string) => _ONE OF THE ABOVE`  
    a function that receives `{ term }` and returns one of the above sets

### autoFocus?: `boolean`

Automatically focus on the first element when the menu opens  
**Default:** false

### delay?: `number`

The delay (in milliseconds) between a keystroke and a search. This acts like a throttle between source calls  
**Default:** 300

### minLength?: `number`

Minimum term entered by the user before we query the source  
**Default:** 2

### recordMapper?: `(input: Record<string, string>) => T[]`

Define how an object should be mapped to the type `T`  
**Default:** An array where the property name becomes `label` and it's value becomes `value`

### position?: `IPositionData`

How shold the autocomplete box positioned  
**Default:** `{ my: "top center", at: "botom center" }`

### renderers?: IRenderers<T>;

Specify how we render the elements

### appendTo?: `HTMLElement`

Append the menu to this element, instead of the body

### logger?: `JavascriptLogger`

Log stages of the autocomplete processes

## Option Methods

### onClose

Called after the menu has been closed  
**Call:**

```TS
onClose: (ev: Event, data: { ul: HTMLUListElement }) => {}
```

### onCreated

Called after the menu has been created, but before being opened  
**Call:**

```TS
onCreated: (ev: Event, data: { ul: HTMLUListElement }) => {}
```

### onItemFocus

Called as soon as an item is focused, but before changing its state  
**Call:**

```TS
onItemFocus: (
    ev: Event,
    data: {
        ul: HTMLUListElement
        item: <T>, // Your generic type, if specified
        input: HTMLInputElement
    }
) => {}
```

### onItemSelect

Called as soon as an item is selecetd, but before changing any state  
**Call:**

```TS
onItemSelect: (
    ev: Event,
    data: {
        ul: HTMLUListElement
        item: <T>, // Your generic type, if specified
        input: HTMLInputElement
    }
) => {}
```

### onOpen

Called before the menu has been opened and any position data is calculated  
**Call:**

```TS
onOpen: (ev: Event, data: { ul: HTMLUListElement }) => {}
```

### onResponse

Called after processing the response and before creating the menu  
**Call:**

```TS
// T is your generic type, if specified
onResponse: (ev: Event, data: { items: T[] }) => {}
```

### onSearch

Called before processing the search  
**Call:**

```TS
// T is your generic type, if specified
onSearch: (ev: Event, data: { term: string }) => {}
```

### onStart

A method called after events have been added  
**Call:**

```TS
// T is your generic type, if specified
onStart: () => {}
```

### onStop

A method called after events have been removed  
**Call:**

```TS
// T is your generic type, if specified
onStop: () => {}
```
