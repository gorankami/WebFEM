/**
    Copyright 2014 Goran Antic

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace WebApp
{
    /// <summary>
    /// Summary description for GetModel
    /// </summary>
    public class GetBigData : IHttpHandler
    {
        private string templatePath = @"C:\Users\Goran\Desktop\MASTER_v16\WebApp\templates\";

        public void ProcessRequest(HttpContext context)
        {
            string modelId = context.Request.QueryString["modelId"];
            string contourId = context.Request.QueryString["contourId"];
            context.Response.ContentType = "application/octet-stream";
            //context.Response.ContentType = "application/json";

            using (web_femEntities entities = new web_femEntities())
            {
                string result;
                int id;
                if (!String.IsNullOrEmpty(modelId) && Int32.TryParse(modelId, out id))
                {
                    result = "{" +
                                "\"numVertices\": #NUMV," +
                                "\"numIndices\": #NUMI," +
                                "\"minimum\": {#MIN}," +
                                "\"maximum\": {#MAX}," +
                                "\"vertexData\": [#VBUFFER]," +
                                "\"indexData\": [#IBUFFER]" +
                            "}";

                    var geometry = (from g in entities.ModelGeometries
                                   where g.Id == id
                                   select new
                                   {
                                       vertexBuffer = g.VertexBuffer,
                                       numVertices = g.NumVertices,
                                       indexBuffer = g.IndexBuffer,
                                       numIndices = g.NumIndices,
                                       minX = g.MinX,
                                       minY = g.MinY,
                                       minZ = g.MinZ,
                                       maxX = g.MaxX,
                                       maxY = g.MaxY,
                                       maxZ = g.MaxZ
                                   }).FirstOrDefault();

                    result = result.Replace("#NUMV",geometry.numVertices.ToString());
                    result = result.Replace("#NUMI",geometry.numIndices.ToString());
                    result = result.Replace("#MIN", String.Format("\"x\":{0},\"y\":{1},\"z\":{2}", geometry.minX, geometry.minY, geometry.minZ));
                    result = result.Replace("#MAX", String.Format("\"x\":{0},\"y\":{1},\"z\":{2}", geometry.maxX, geometry.maxY, geometry.maxZ));

                    context.Response.Write(result
                        .Replace("#VBUFFER", geometry.vertexBuffer)
                        .Replace("#IBUFFER", geometry.indexBuffer)
                    );
                }
                else if (!String.IsNullOrEmpty(contourId) && Int32.TryParse(contourId, out id))
                {
                    result = "{" +
                                "\"maxValue\": #MAXVAL," +
                                "\"minValue\": #MINVAL," +
                                "\"numValues\": #NUMV," +
                                "\"valueData\": [#VBUFFER]" +
                            "}";

                    var contour = (from c in entities.ModelContours
                                  where c.Id == id
                                  select new
                                  {
                                      valueBuffer = c.ValueBuffer,
                                      numValues = c.NumValues,
                                      minValue = c.MinValue,
                                      maxValue = c.MaxValue
                                  }).FirstOrDefault();

                    result = result.Replace("#NUMV", contour.numValues.ToString());
                    result = result.Replace("#MINVAL", contour.minValue.ToString());
                    result = result.Replace("#MAXVAL", contour.maxValue.ToString());
                    context.Response.Write(result.Replace("#VBUFFER", contour.valueBuffer));
                }
                else
                {
                    context.Response.Write("{}");
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}