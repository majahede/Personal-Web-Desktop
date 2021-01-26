# &lt;flipping-tile&gt;
A web component that represents a flipping tile.

## Attributes

### `src`
A string containing the path to the image that will be shown on the flipped tile.

Default value: undefined

### `hidden`
A Boolean attribute which, if present, hides the element.

Default value: undefined

### `disabled`
A Boolean attribute which, if present, indicates that the user will not be able to interact with the element.

Default value: undefined

## Events
| Event Name | Fired When |
|------------|------------|
| `fliptile`| The tile is flipped.


## Example
```html
   <flipping-tile src="./images/1.png"></flipping-tile>
```