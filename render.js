'use strict'

class Renderer {
	constructor(canvas) {
		this.gl = this.initWebGL(canvas);
		this.canvas = canvas;
		this.camera = {'x': 0, 'y': 0, 'z': 0}
		this.renderTarget = {}

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.LEQUAL);
		this.gl.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);

		this.renderBuffer = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.renderBuffer);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.canvas.width, this.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	initWebGL(canvas) {
		let gl = null;

		try {
			gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch(e) {}

		if (!gl) {
			console.log("Unable to initialize WebGL. Your browser may not support it.");
			gl = null;
		}

		return gl;
	}

	setSize(width, height){
		this.gl.viewport(0, this.canvas.height = height, this.canvas.width = width, 0);
	}

	initShader(source, type) {
		let shader;
		switch (type) {
			case "vs":
				shader = this.gl.createShader(gl.VERTEX_SHADER);
				break;
			case "fs":
				shader = this.gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default:
				return null;
		}

		this.gl.shaderSource(shader, theSource);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
			console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
		else
			return shader;
	}

	initProgram(shaders) {
		shaderProgram = this.gl.createProgram();
		shaders.forEach(id => this.gl.attachShader(shaderProgram, id));
		this.gl.linkProgram(shaderProgram);

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			console.log("Unable to initialize the shader program: " + shaders);
			return;
		}

		return shaderProgram;
	}

	initBuffer(data) {
		buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(0);
		return buffer;
	}

	enableProgramAttributes(shaderProgram, attributes) {
		this.gl.useProgram(shaderProgram);
		attributes.forEach(name => this.gl.enableVertexAttribArray(this.gl.getAttribLocation(shaderProgram, name)));
		this.gl.useProgram(0);
	}

	setUniform(shaderProgram, field, data) {
		let uniform = this.gl.getUniformLocation(shaderProgram, field);
		this.gl.uniformMatrix4fv(uniform, false, new Float32Array(data));
	}

	addRenderTarget(renderObject, transform) {
		if (this.renderTarget[buffer])
			this.renderTarget[buffer].put(transform);
		else
			this.renderTarget[buffer] = [transform];
	}

	render() {
		this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.renderTarget.forEach(renderObject);
		this.swapBuffers();
	}

	renderObject(renObj) {

	}

	swapBuffers() {

	}
 }
class RenderObject {
	constructor(buffer, program, uniform) {
		this.buffer = buffer;
		this.program = program;
		this.uniform = uniform;
	}
}

class Transform {
	constructor(x, y, z, scale, rotation) {
		this._pos = {x: x, y: y, z: z}
		this._scale = scale;
		this._rotation = rotation;
		this._matrix = this.computeMatrix();
		this.needUpdate = true;
	}

	get pos() {
		return {x: this._pos.x, y: this._pos.y, z: this._pos.z}
	}

	set x(value) {
		this._pos.x = value;
		this.needUpdate = true;
	}

	get x() {
		return this._pos.x;
	}

	set y(value) {
		this._pos.y = value;
		this.needUpdate = true;
	}

	get y() {
		return this._pos.y;
	}

	set z(value) {
		this._pos.z = value;
		this.needUpdate = true;
	}

	get z() {
		return this._pos.z;
	}

	set scale(value) {
		this._scale = value;
		this.needUpdate = true;
	}

	get scale() {
		return this._scale;
	}

	set rotation(value) {
		this._rotation = value;
		this.needUpdate = true;
	}

	set rotationDeg(value) {
		this.rotation = value / 360 * 6.28;
	}

	get rotation() {
		return this._rotation;
	}

	get rotationDeg() {
		return this.rotation * 360 / 6.28;
	}

	get matrix() {
		if (this.needUpdate) {
			this._matrix = this.computeMatrix();
			this.needUpdate = false;
		}
		return this._matrix;
	}

	computeMatrix() {
		return ModelMatrix(
				RotationMatrix(this._rotation),
				TranslationMatrix(this._pos),
				ScaleMatrix({x: this._scale, y: this._scale, z: this._scale})
			);
	}
}

class Uniform {
	constructor(field, value) {
		this.field = field;
		this.value = value;
	}
}
