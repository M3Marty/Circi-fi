'use strict'

function BasicMatrix() {
	return $M([
			[1,	0,	0,	0],
			[0,	1,	0,	0],
			[0,	0,	1,	0],
			[0,	0,	0,	1]
		]);
}

function RotationMatrix(rad) {
	return $M([
			[Math.cos(rad),	-Math.sin(rad),	0,	0],
			[Math.sin(rad),	Math.cos(rad),	0,	0],
			[0,				0,				1,	0],
			[0,				0,				0,	1]
		]);
}

function TranslationMatrix(vec) {
	return $M([
			[1,	0,	0,	vec.x],
			[0,	1,	0,	vec.y],
			[0,	0,	1,	vec.z],
			[0, 0,	0,	1]
		]);
}

function ScaleMatrix(vec) {
	return $M([
			[vec.x,	0,		0,		0],
			[0,		vec.y,	0,		0],
			[0,		0,		vec.z,	0],
			[0,		0,		0,		1]
		]);
}

function ModelMatrix(rotationMat, transMat, scaleMat) {
	return transMat.x(rotationMat).x(scaleMat);
}
